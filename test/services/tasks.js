

describe('Service: Tasks', () => {

    const Users = app.db.models.Users;
    const Tasks = app.db.models.Tasks;

    let userRequest = {
        name: 'User tasks',
        email: 'user.tasks@gmail.com',
        password: '123456'
    }

    let tasks;

    before(done => {
        // ORM
        Users
            .destroy({ where: { email: userRequest.email } })
            .then(() =>
                Users.create(userRequest)
            )
            .then(user => {
                tasks = [
                    {
                        title: 'Criar tarefa 1',
                        user_id: user.id
                    },
                    {
                        title: 'Criar tarefa 2',
                        user_id: user.id
                    },
                    {
                        title: 'Criar tarefa 3',
                        user_id: user.id
                    }
                ]
                Tasks.bulkCreate(tasks)
                done();
            });
    });

    describe('GET /tasks', () => {

        let token;

        before((done) => {
            request
                .post('/token')
                .send({
                    email: userRequest.email,
                    password: userRequest.password
                })
                .end((err, res) => {
                    token = res.body.token;
                    done(err);
                })
        })

        it('retorna a lista de tarefa', (done) => {
            request
                .get('/tasks')
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body).to.be.an('array');
               
                     for (let i = 0, size = res.body.lenght; i < size; i++) {
                        expect(res.body[i].title).to.eql(tasks[i].title);
                        expect(res.body[i].user_id).to.eql(tasks.user_id);
                        expect(res.bopdy[i].done).to.eql(false);
                    };
                    done(err);
                })
        });

        // before((done) => {

        // Obter uma lista de tarefas
        // Dessa lista extrair um item
        // Este item deve ser usado para o cenário Obter uma única tarefa


        // });

        // it('retorna uma única tarefa', (done) => {
        //     request
        //         .get(`/tasks/${tasksResponse[0].id}`)
        //         .set('Authorization', `JWT ${token}`)
        //         .end((err, res) => {
        //             expect(res.statusCode).to.eql(200);
        //             console.log(res.body)
        //             done(err);
        //         })
        // });

        // it('Tarefa não encontrada', (done) => {
        //     request
        //         .get('/tasks/0')
        //         .set('Authorization', `JWT ${token}`)
        //         .end((err, res) => {
        //             expect(res.statusCode).to.eql(404);
        //             done(err);
        //         })
        // });
    });
});