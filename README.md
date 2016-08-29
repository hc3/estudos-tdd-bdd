# Estudo sobre Testes com MEAN
um resumo dos estudos sobre TDD e BDD com MEAN

## Aula 01 ( babel + express)

primeiro de tudo vamos iniciar uma aplicação com o comando:
````
npm init
````
feito isso foi criado o package.json agora é preciso instalar o express e o babel:
````
npm install babel-cli babel-preset-es2015 --save-dev
npm install express --save
````
criamos o arquivo <b>app.js</b> e o <b> index.js </b>

app.js = será o arquivo que vai iniciar o express.
index.js = será o arquivo que vai iniciar a aplicação.

vamos no package.json adicionar um comando para rodar o npm start

em scripts adicionamos a segunda propriedade:

"start":"babel-node index.js"

<b>app.js</b>
````js
import express from 'express';

const app = express();

export default app;
````

<b>index.js</b>
````js
import app from './app';

app.listen('7000', () => {
  console.log('app is running on port 7000');
});
````
<p>
  a primeira aula é uma introdução, na segunda aula já vamos criar um teste
</p>

## Aula 02 ( mocha + chai + supertest)

primeiro vamos instalar as dependências com o comando:
````
npm install mocha chai supertest --save-dev
````

vamos agora criar os diretórios <b>/test/integration</b>, que é onde vão ficar os testes de integração nesse mesmodiretório vamos criar os arquivos

<b>app.js</b>
````js
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

          expect(res.body[0].name).to.be.eql(defaultBook.name);
          expect(res.body[0].id).to.be.eql(defaultBook.id);

          done(err);
        });
    });
  });

});
````

<b>helpers</b>
````js
import supertest from 'supertest';
import chai from 'chai';
import app from '../../app';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;
````

<b>mocha.opts</b>
````
--require test/integration/helpers.js
--reporter spec
--compilers js:babel-core/register
--slow 5000
````

o arquivo <b>mocha.opts</b> faz as configuraçoes do mocha o arquivo <b>helpers.js</b> importar os modulos do supertest do chai e importa app e passa para variáveis globais que serão usadas em <b>app.js</b> sendo elas expect que cria o teste usando o expect do chai ( vide documentação ) e o request que é uma requisiçã simulada para nosso ap e o request que é uma requisiçã simulada para nosso app, nesse primeiro capitulo configuramos app.js da nossa aplicação da seguinte maneira:

<b>app.js</b> (express)
````js
import express from 'express';

const app = express();

app.route('/books')
  .get((req,res) => {
    res.json([{
      id:1,
      name:'Default Book'
    }]);
  });

export default app;
````
e com isso já podemos rodar os teste com o comando:<b>npm run test-integration</b>

## Aula 03 (sequelize e sqlite)

Na Aula 02 vimos como funcionam basicamente os testes, primeiro escrevemos o teste e rodamos para ver ele "quebrar" e então fazemos a implementação de uma forma básica para o teste passar.
Vamos começar instalando duas dependências para essa aula:
````
npm install sequelize sqlite3 --save
````
O sequelize é um ORM para banco relacional e o sqlite é um banco relacional bem simples, feito isso criamos o diretório <b> config </b> e dentro criamos os arquivos:
<b>config.js</b>
````js
export default {
  database: 'books',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'books.sqlite',
    define: {
      underscored: true
    }
  }
}
````

<b>datasource.js</b>
````js
import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

let database = null;

export default (app) => {
  if(!database) {
    const config = app.config,
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
    database = {
      sequelize,
      Sequelize,
      models: {}
    };

    sequelize.sync().done() => {
      return database;
    };
  }
  return database;
};
````

e agora criamos o diretório <b>models</b> e nele criamos o arquivo <b>Books.js</b>.

Aula finalizada, o que temos de interessante nessa aula são os arquivos config.js e datasource.js que vão nos auxiliar com o banco de dados para que nossa api retorne dados vindo de um banco na próxima aula vamos configurar o modelo.

## Aula 04

na Aula 03 criamos o arquivos Books.js então agora vamos ao código dele.
<b>Books.js</b>
````js
export default (sequelize,DataType) => {
  const Books = sequelize.define('Books',{
    id:{
      type:DataType.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    name:{
      type:DataType.STRING,
      allowNull:false,
      validade:{
        notEmpty:true
      }
    }
  });
  return Books;
}
````

feito o model agora temos que importar o model sempre que iniciar o banco vamos para <b>datasource.js</b>
````js
import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

let database = null;

const loadModels = (sequelize) => {
    const dir = path.join(__dirname,'../models');
    let models = [];
    fs.readdirSync(dir).forEach(file => {
      const modelDir = path.join(dir,file),
      model = sequelize.import(modelDir);
      models[model.name] = model;
    });
    return models;
};

export default (app) => {
  if(!database) {
    const config = app.config,
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
    database = {
      sequelize,
      Sequelize,
      models: {}
    };

    database.models = loadModels(sequelize);

    sequelize.sync().done(() => {
      return database;
    });
  }
  return database;
};
````

vamos agora alterar o <b>app.js</b> ( express ), vamos adicionar a seguintes linhas:
````js
import express from 'express';
import config from './config/config';
import datasource from './config/datasource';

const app = express();
app.config = config;
app.datasource = datasource(app);

// seta uma porta deixando a configuração global que será usadas em index.js

app.set('port',7000);
// importa o Books (model)
const Books = app.datasource.models.Books;

app.route('/books')
  .get((req,res) => {
    // faz uma busca por todos os books
    Books.findAll({})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  });

export default app;
````

<b>index.js</b>
````js
import app from './app';

app.listen(app.get('path'), () => {
  console.log(`app is running on port ${app.get('port')}`);
});
````

podemos agora rodar o <b>npm run test-integration</b> e podemos ver o teste quebrando, vamos agora configurar o teste.
<b>/test/integration/app.js</b>
````js
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

          expect(res.body[0].name).to.be.eql(defaultBook.name);
          expect(res.body[0].id).to.be.eql(defaultBook.id);

          done(err);
        });
    });
  });

});
````

## Aula 05

Na aula 04 colocamos o teste para funcionar com os dados integrados com o banco (sqlite) e nessa aula vamos fazer os testes para as outras operações do CRUD.
Quando usamos testes podemos simplemente começar a implementar pelo teste por exemplo vamos agora implementar uma rota para buscar 1 livro, como devemos fazer? simples criamos o teste rodamos vemos o teste quebrar e então implementamos o código que vai fazer o teste passar vamos ao código:

<b>teste para buscar um book</b>
no arquivo /test/integration/app.js adicionamos a seguinte linha e com isso já temos o teste, vamos rodar o teste e ver ele quebrar:
<b>npm run test-integration</b>
````js
describe('Route GET /books/{id}', () => {
  it('should return a books', done => {
    request
      .get('/books/1')
      .end((err, res) => {

        expect(res.body.name).to.be.eql(defaultBook.name);
        expect(res.body.id).to.be.eql(defaultBook.id);

        done(err);
      });
  });
});
````
podemos ver que o teste quebrou porque falta implementar o comportamento, vamos a ele no <b>app.js</b> (express)
````js
app.route('/books/:id')
  .get((req,res) => {
    Books.findOne({where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  });
````
agora podemos rodar o teste novamente e ver que tudo passou ;D , vamos perceber aqui que não foi preciso abrir o browser para garantir que o comportamento está funcionando corretamente e com isso já começamos a ver como os testes podem nos ajudar no dia-a-dia, vamos a outras operações do crud.
** IMPORTANTE ANTES DE IMPLEMENTAR OS TESTES VAMOS INSTALAR O MODULO DE BODY-PARSER PARA PARSEAR OS DADOS PARA JSON **
npm install body-parser --save
agora vamos no express e configurar e BODY-PARSER adicionando as seguintes linhas de código:
````js
...
import bodyParser from 'body-parser';
...
app.use(bodyParser.json());
...
````


#### CREATE
<b>TESTE</b>
````js
describe('Route POST /books', () => {
  it('should create a new book', done => {
    const newBook = {
      id:2,
      name:'newBook'
    };
    request
      .post('/books')
      .send(newBook)
      .end((err, res) => {

        expect(res.body.id).to.be.eql(newBook.id);
        expect(res.body.name).to.be.eql(newBook.name);

        done(err);
      });
  });
});
````

<b>APP</b>
````js
app.route('/books')
  .get((req,res) => {
    Books.findAll({})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .post((req,res) => {
    Books.create(req.body)
      .then(result => res.json(result))
      .catch(err => res.status(412))
  });
````

#### UPDATE
<b>TESTE</b>
````js
describe('Route PUT /books/{id}', () => {
  it('should update a book', done => {
    const updatedBook = {
      id:1,
      name:'Updated Book'
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
````

<b>APP</b>
````js
app.route('/books/:id')
  .get((req,res) => {
    Books.findOne({where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .put((req,res) => {
    Books.update(req.body,{where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  });
````

#### REMOVE
<b>TESTE</b>
````js
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
````

<b>APP</b>
````js
app.route('/books/:id')
  .get((req,res) => {
    Books.findOne({where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .put((req,res) => {
    Books.update(req.body,{where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .delete((req,res) => {
    Books.destroy({where: req.params})
      .then(result => {res.sendStatus(204)})
      .catch(err => {res.status(412)})
  });
````

finalizamos o CRUD e já está tudo funcionando, aqui já podemos ver que nem abrimos o browser sequer rodamos a aplicação e já temos a certeza de que está tudo funcionando os testes são maravilhosos gente, segue os arquivos completos do teste e do express:

<b>TESTEAS /test/integration/app.js</b>
````js
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
        id:2,
        name:'newBook'
      };
      request
        .post('/books')
        .send(newBook)
        .end((err, res) => {

          expect(res.body.id).to.be.eql(newBook.id);
          expect(res.body.name).to.be.eql(newBook.name);

          done(err);
        });
    });
  });

  describe('Route PUT /books/{id}', () => {
    it('should update a book', done => {
      const updatedBook = {
        id:1,
        name:'Updated Book'
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
````

<b>EXPRESS app.js</b>
````js
import express from 'express';
import config from './config/config';
import datasource from './config/datasource';
import bodyParser from 'body-parser';

const app = express();
app.config = config;
app.datasource = datasource(app);
app.set('port',7000);
app.use(bodyParser.json());
const Books = app.datasource.models.Books;

app.route('/books')
  .get((req,res) => {
    Books.findAll({})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .post((req,res) => {
    Books.create(req.body)
      .then(result => res.json(result))
      .catch(err => res.status(412))
  });

app.route('/books/:id')
  .get((req,res) => {
    Books.findOne({where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .put((req,res) => {
    Books.update(req.body,{where: req.params})
      .then(result => {res.json(result)})
      .catch(err => {res.status(412)})
  })
  .delete((req,res) => {
    Books.destroy({where: req.params})
      .then(result => {res.sendStatus(204)})
      .catch(err => {res.status(412)})
  });

export default app;
````

## Aula 06
