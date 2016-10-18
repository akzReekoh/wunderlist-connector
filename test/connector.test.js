'use strict';

var cp        = require('child_process'),
	should    = require('should'),
	deviceId1 = Date.now(),
	connector;

describe('Connector', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
		this.timeout(7000);
		setTimeout(function () {
			connector.kill('SIGKILL');
			done();
		}, 5000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						client_id: '53e20ff6a3bf0fb70fa4',
						access_token: '2239528cd7b524f6fe7a74f6c5682866e7fd2f066a98791c0debefa7e81a'
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
                    list_id: 272384342,
                    title: 'Sample Task, Reekoh Test',
                    assignee_id: 123,
                    completed: false,
                    due_date: '2016-11-02',
                    starred: false
				}
			}, done);
		});
	});
});