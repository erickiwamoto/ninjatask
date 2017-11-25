

describe('Service: Users', () => {
    const Users = app.db.models.Users;

    describe('POST /user', () => {

        let userRequest = {
            name: 'Erick',
            email: 'erickiwamoto@gmail.com',
            password: '123456'
        }

        describe('status 200', () => {
            before(done => {
                // ORM
                Users.destroy({ where: { email: userRequest.email } })
                done();
            });

            it('cadastro de novo usuário', (done) => {
                request
                    .post('/users')
                    .send(userRequest)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.name).to.eql(userRequest.name);
                        expect(res.body.email).to.eql(userRequest.email);
                        done(err);
                    });
            });
        });

        describe('status 409', () => {

            let userRequest = {
                name: 'User 409',
                email: 'user409@gmail.com',
                password: '123456'
            }

            before(done => {
                // ORM
                Users
                    .destroy({ where: { email: userRequest.email } })
                    .then(() => {
                        Users.create(userRequest)
                        done();
                    });
            });

            it('cadastro de novo usuário', (done) => {
                request
                    .post('/users')
                    .send(userRequest)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(409);
                        expect(res.body.msg).to.eql('Oops. Looks like you already have an account with this email address.');
                        done(err);
                    });
            });

        });



    });
});