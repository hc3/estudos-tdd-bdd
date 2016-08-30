import BooksController from '../../../controllers/books';

describe('Controllers: Books', () => {
  describe('GET all books getAll()', () => {
    it('should return a list of books', () => {
      const Books = {
        findAll: td.function()
      };

      const expectedResponse = [{
        id: 1,
        name: 'Test Book',
        created_at: '2016-08-06T23:55:36.692Z',
        updated_at: '2016-08-06T23:55:36.692Z',
      }];
        
      td.when(Books.findAll({})).thenResolve(expectedResponse);


      const booksController = new BooksController(Books);
      return booksController.getAll()
      .then(response => expect(response.data).to.be.eql(expectedResponse));
    });    
  });

  describe('GET a book getById()', () => {
    it('should return a book', () => {
      const Books = {
        findOne: td.function()
      };

      const expectedResponse = [{
        id: 1,
        name: 'Test Book',
        created_at: '2016-08-06T23:55:36.692Z',
        updated_at: '2016-08-06T23:55:36.692Z',
      }];
        
        td.when(Books.findOne({where: {id:1}})).thenResolve(expectedResponse);


      const booksController = new BooksController(Books);
      return booksController.getById({id:1})
      .then(response => expect(response.data).to.be.eql(expectedResponse));
    });    
  });

  describe('CREATE a book create()', () => {
    it('should create a book', () => {
      const Books = {
        create: td.function()
      };


      const requestBody = {
        name:'Test Book'
      }

      const expectedResponse = [{
        id: 1,
        name: 'Test Book',
        created_at: '2016-08-06T23:55:36.692Z',
        updated_at: '2016-08-06T23:55:36.692Z',
      }];
        
        td.when(Books.create(requestBody).thenResolve(expectedResponse));


      const booksController = new BooksController(Books);
      return booksController.create(requestBody)
      .then(response => expect(response.data).to.be.eql(expectedResponse));
    });    
  });


});
