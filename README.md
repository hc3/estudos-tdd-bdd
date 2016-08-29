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

          expect(res.body[0].name).to.be.equal(defaultBook.name);
          expect(res.body[0].id).to.be.equal(defaultBook.id);

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


## Aula 05
