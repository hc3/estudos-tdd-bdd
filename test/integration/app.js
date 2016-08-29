describe('Routes books', () => {
  // busca o model de Books
  const Books = app.datasource.models.Books,
  defaultBook = {
    id:1,
    name:'Default Book'
  };
  // deixa explicito para o framework de testes que antes de rodar os testes ele deve
  // realizar os passos abaixo.
  beforeEach(done => {
    Books
      // como o model é criado pelo sequelize o destroy faz parte do sequelize (vide documentação)
      .destroy({where:{}})
      .then(() => Books.create(defaultBook))
      .then(() => {
        done();
      });
  });

  describe('Route GET /books', () => {
    it('should return a list of books', done => {
      request
        .get('/books')
        .end((err, res) => {

          expect(res.body[0].name).to.be.equal(defaultBook.name);
          expect(res.body[0].id).to.be.equal(defaultBook.id);

          done(err);
        });
    });
  });

});
