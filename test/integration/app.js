describe('Routes books', () => {

  const defaultBook = {
    id:1,
    name:'Default Book'
  };

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
