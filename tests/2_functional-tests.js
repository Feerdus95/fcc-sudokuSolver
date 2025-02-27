const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST requests to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      const input = '1.5..2.84..63.12.7.2';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      const input = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST requests to /api/check', () => {
    test('Check a puzzle placement with all fields', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'A2', value: '4' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 1);
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'B3', value: '5' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 2);
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'B1', value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 3);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ 
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x',
          coordinate: 'A2',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2', coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'K2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate: 'A2', value: '0' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});