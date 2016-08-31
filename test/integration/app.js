describe('Routes books', () => {
  // busca o model de Books
  const Books = app.datasource.models.Books;
  const defaultBook = {
    id: 1,
    name: 'Default Book',
    description: 'Default description',
  };
  // deixa explicito para o framework de testes que antes de rodar os testes ele deve
  // realizar os passos abaixo.
  beforeEach(done => {
    Books
      // como o model é criado pelo sequelize o destroy faz parte do sequelize (vide documentação)
      .destroy({ where: {} })
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
          expect(res.body[0].id).to.be.eql(defaultBook.id);
          expect(res.body[0].name).to.be.eql(defaultBook.name);

          done(err);
        });
    });
  });

  describe('Route GET /books/{id}', () => {
    it('should return a books', done => {
      request
        .get('/books/1')
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultBook.id);
          expect(res.body.name).to.be.eql(defaultBook.name);

          done(err);
        });
    });
  });

  describe('Route POST /books', () => {
    it('should create a new book', done => {
      const newBook = {
        id: 2,
        name: 'newBook',
        description: 'new description'
      };
      request
        .post('/books')
        .send(newBook)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(newBook.id);
          expect(res.body.name).to.be.eql(newBook.name);
          expect(res.body.description).to.be.eql(newBook.description);
          done(err);
        });
    });
  });

  describe('Route PUT /books/{id}', () => {
    it('should update a book', done => {
      const updatedBook = {
        id: 1,
        name: 'Updated Book',
      };
      request
        .put('/books/1')
        .send(updatedBook)
        .end((err, res) => {
          expect(res.body).to.be.eql([1]);

          done(err);
        });
    });
  });

  describe('Route DELETE /books/{id}', () => {
    it('should delete a book', done => {
      request
        .delete('/books/1')
        .end((err, res) => {
          expect(res.statusCode).to.be.eql(204);

          done(err);
        });
    });
  });
});
