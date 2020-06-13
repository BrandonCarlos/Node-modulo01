const express = require('express');//Importando o "EXPRESS"
//const express é um FUNCTION

//Vamos iniciar a aplicação
const server = express();//
//------Precisamos dizer pro EXPRESS que vamos utilizar JSON, precisamos dizer pro EXPRESS ler JSON ---
//A linha abaixo é para dizer pro EXPRESS LER JSON NO CORPO DA REQUISIÇÃO
server.use(express.json());//não esquecer de por json(), pois é uma FUNÇÃO
//"use", PEDINDO PRA PASSAR UM PLUGIN, UM MÓDULO

//CRUD - CREATE, READ, UPDATE, DELETE

//Query Params = ?teste=1
//Route Params = /users/1
//Request body = {"name": "Brandon", "email": "Brandon@gmail.com}

//VAMOS fazer um VETOR com alguns nomes.
const usuarioss = ['Diego', 'Cláudio', 'Victor', 'Augusto', 'Brandon'];

//Criando MIDDLEWARE LOCAL para verificar se existe ELEMENTO NO ARRAY
function ChecarSeUsuarioExisteNoArray(req, res, next){
  const us = usuarioss[req.params.numero];//Se no ROUTE PARAMS o usuario digitar um número
  //e tiver esse ELEMENTO no ARRAY, guarde na CONST "us"

  if(!usuarioss[req.params.numero]){//Se no ROUTE PARAMS, não tiver o número(indice) no ARRAY
    //irá retornar "Esse usuário não existe no ARRAY"
    return res.status(400), res.json({ erro: `Esse usuário não existe no ARRAY`});
  }

  //Nova VARIAVEL dentro do "req"
  //"req" recebe uma variavel "usuario" que recebe "us" a CONST que tem o indice(ELEMENTO)
  //que o usuario digitou no ROUTE PARAMS 
  req.usuario = us;//Dentro da váriavel req.usuario tem o indice(ELEMENTO) que o usuario digitou no 
  //ROUTE PARAMS
  //req.usuario PODE TER ELEMENTO guardado ou NÃO

  return next();
}

server.get('/usuarios/:numero', ChecarSeUsuarioExisteNoArray, (req, res) => {
  return res.json(req.usuario);//REUTILIZANDO a váriavel "req.usuario", que pode ter GUARDADO
  //ELEMENTO DO VETOR ou NÃO
  //MIDDLEWARE LOCAL utilizado como PARÂMETRO de uma ROTA
  //MIDDLEWARE faz a VALIDAÇÃO (IF), se tiver elemento na VARIAVEL "req.usuario"
  //retornará, SE NÃO mostrará uma mensagem de ERRO 
  
});


//Criando MIDDLEWARE LOCAL
function ChecarSeUsuarioColocouONome(req, res, next){//Isto é MIDDLEWARE pelos parâmetros REQ, RES, NEXT
  if(!req.body.nome){//se não tiver a INFORMAÇÃO "nome", no CORPO DA REQUISIÇÃO 
    return res.status(400).json({ erro: `Informe o "nome" no CORPO DA REQUISIÇÃO`}) //error: <-- é UMA VARIAVEL
    //status(400) é para mostrar que houve um ERRO na REQUISIÇÃO
  }

  return next();//Se o usuário informou o "nome" no CORPO DA REQUISIÇÃO,
  //a REQUISIÇÃO continua NORMALMENTE.
}

server.post('/CriandoUsuarioTop', ChecarSeUsuarioColocouONome, (req, res) => {
  //agora temos um parâmetro de VALIDAÇÃO(IF) se o usuario colocou o "nome",
  //ChecarSeUsuarioColocouONome 
  const { nome } = req.body;// { nome } <-- DESESTRUTURAÇÃO
  usuarioss.push(nome); 
  
  return res.json(usuarioss);
  });


//Vamos usar MIDDLEWARE GLOBAL
//quando clicarmos em SEND lá no INSOMNIA irá retornar qual método REQUERIMOS,
//ex: GET, POST, PUT, DELETE(CRUD), e estamos REQUERINDO a URL(ROTA) -- "req.url"
//"req, res" = são VARIAVEIS
server.use((req, res, next) => {
  console.time('A requisição demorou: ');//console.time() <-- uso para CALCULAR O TEMPO de algo
  //no caso o tempo que demora para fazer uma REQUISIÇÃO
  //o mesmo nome = ('request'), precisa estar aki e lá abaixo no timeEnd('request'), para poder
  //CALCULAR O TEMPO DE REQUISIÇÃO
  console.log(`Método que você fez a REQUISIÇÃO É: ${req.method}; A URL é: ${req.url}`);
  //GET, POST, PUT, DELETE são (MÉTODOS)
  //No imsomnia as outras ROTAS de GET, POST, PUT, DELETE, não funcionaram, o que está rodando
//é o MIDDLEWARE GLOBAL(qualquer rota o MIDDLEWARE será chamado) e está bloqueando as demais
//ROTAS, então vamos usar o parâmetro(NEXT) para as ROTAS abaixo continuarem FUNCIONANDO
//NEXT é uma FUNÇÃO
  next();//depois que clicar em SEND no INSOMNIA vai REQUERIR e a linha abaixo será EXECUTADA

  console.timeEnd('A requisição demorou: ');//aki é o fim do tempo, mostrando quanto tempo DEMOROU
  //para fazer a REQUISIÇÃO
});



//Vamos deletar um usuário
server.delete('/DeletandoUsuario/:numero', ChecarSeUsuarioExisteNoArray, (req, res) => {
  const { numero } = req.params;
  //o método abaixo SPLICE(), deleta o apartir do número que o usuario digitou em diante
  //ex: numero digitado: 5, SERÃO EXCLUIDOS 5, 6, 7 , 8 valores do vetor
  //e pode determinar quantos indices em diante DELETAR, 
  //ex: só quero que delete 1 usuário, achou DELETA e acabou.
  usuarioss.splice(numero, 1);//De acordo com o que o USUARIO digitou, delete apenas 1 USUARIO(1 INDICE)
  return res.json('success');//retornar a mensagem em formato JSON = 'success';

});

//Vamos editar um usuário
server.put('/usuarioss/:numero', ChecarSeUsuarioColocouONome, ChecarSeUsuarioExisteNoArray, (req, res) => {
  const { numero } = req.params;//Primeiro pegamos o número que o USUARIO colocar no ROUTE PARAMS
  const { nome } = req.body;//pegamos o {NOME: "qualquer coisa"} que o usuario colocar no CORPO DA REQUISIÇÃO
  usuarioss[numero] = nome;//no VETOR de acordo com o número que o usuário colocou no ROUTE PARAMS
  //irá ser alterado(SOBREESCRITO), VETOR[NUMERO_DO_ROUTE_PARAMS] = nome;
  return res.json(usuarioss);//mostrando no FRONT-END: o vetor USUARIOSS inteiro, (TODOS OS NOMES)
});


server.post('/CriandoUsuario', (req, res) => {
  const { nome } = req.body;//Aki está pegando "nome": "qualquercoisa", do CORPO DA REQUISIÇÃO
  //(AQUELE CAMPO DO INSOMNIA), e jogando na CONST NOME, usei DESESTRUTURAÇÃO também
  usuarioss.push(nome);//inserindo no VETOR com o método(PUSH), o nome que foi colocado no CORPO DA REQUISIÇÃO
  //ex: {
  //      "nome": "Brandon"
  //    }
  return res.json(usuarioss);//e retorna todos os "nomes" criados.
});

server.post('/VouCriarMaisUmUsuario', (req, res) => {
  const { sorvetes } = req.body;//usando a DESESTRUTURAÇÃO { qualquercoisa }
  //pegando do BODY DA REQUISIÇÃO("sorvetes": "qualquer coisa"), e guardando na CONST "sorvetes"
  usuarioss.push(sorvetes);//inserindo no array com o método(PUSH), o valor da CONST "sorvetes"
  return res.json(usuarioss);//retornar no FRONT-END, na página: os valores que tem dentro do VETOR "usuarioss"
});

//Listar todos os usuarios basta usar o RETURN APENAS
server.get('/TodosUsuarios', (req, res) => {
  return res.json(usuarioss);
});

server.get('/usuarios/:indexVetor', (req, res) => {
  //Ao invez de pegar o "indexVetor"
  //posso retornar diretamente req.usuario
  return res.json(req.usuario);
  //Irá retornar se achou o elemento no VETOR
  //indexVetor vai percorrer o vetor = "usuarios",
  //0, 1, 2 e encontrará os usuarios
});

const SaboresDeSorvetes = ['Flocos', 'Caramelo', 'Limão', 'Tuti-Fruti', 'Acerola', 'Manga'];
server.get('/sorvete/:indexSabor', (req, res) => {
  const { indexSabor } = req.params;//buscando na URL, o número que vou colocar ex: localhost:3000/sorvete/0   resultado = "Flocos";
  return res.json(SaboresDeSorvetes[indexSabor]);//Vetor e o INDEX QUE EU VOU POR ex: 0, 1, 2
  //Apartir do indice que eu vou INFORMAR ex: 0, 1, 2, será retonado um SABOR DE SORVETE
});


//Vou criar a minha primeira ROTA
server.get('/users/:id', ChecarSeUsuarioExisteNoArray, (req, res) => {//Criei a ROTA = localhost:3000/users
  //OBS: '/users' <- criei a ROTA teste
  // '/users/:' <- os ":" simboliza que vai receber um "ROUTE PARAMS", (indice)
  //"req" pega os Query Params que o usuário colocar tipo localhost:3000/teste/?nome=Brandon
  const nome = req.query.nome;//aqui estou dizendo armazena na váriavel nome = req.query.nome, o que tiver no nome, ex: /?nome=Brandon
  const estado = req.query.estado;// eu vou passar na URL o que estará armazenado em estado
  //ex: /?estado=SP  
  const linguagem = req.query.linguagem;//irei escolher JAVASCRIPT /?linguagem=JavaScript
  const id = req.params.id;
  return res.json({//troquei o SEND, pelo JSON para mandar informação do tipo JSON
    message: `${id} a melhor linguagem de todas`
    //"req" pega QUERY PARAMS, "res" pega dados do QUERY PARAMS e joga na tela(FRONT-END);
  });
  //(send) é uma forma de mandar TEXTO.
});

server.get('/aprendendo/:numeroid', ChecarSeUsuarioExisteNoArray, (req, res) => {
  //se definimos o ROUTE PARAMS = "/:numeroid", quando formos fazer a "req" também deve estar
  //o igual ex: req.params.numeroid <-- igual o ROUTE PARAMS
  const numero = req.params.numeroid;

  return res.json({
    message: `você escolheu o número = ${numero}`
  });
});

server.get('/reactTop/:numero', ChecarSeUsuarioExisteNoArray, (request, response) => {
  const numerito = request.params.numero;//Pegando o Route Params e jogando na const "numerito"
  return response.json({
    message: `Aham você colocou no ROUTE PARAMS o número = ${numerito}`
  });
});

server.get('/desestruturacao/:numerico', ChecarSeUsuarioExisteNoArray, (req, res) => {
  const { numerico } = req.params;//Aki eu fiz um DESESTRUTURAÇÃO { numerico }
  //é o mesmo que fazer: const numerico = req.params.numerico
  //ao invez de repetir "numerico" 2 vezes fazemos a DESESTRUTURAÇÃO { numerico }
  return res.json({
    message: `Você adicionou no ROUTE PARAMS o número = ${numerico}!`
  });
});

server.get('/prova', ChecarSeUsuarioExisteNoArray, (req, res) => {
  const jogo = req.query.jogo;//Coloquei "Jogo" pois na URL está localhost:3000/?jogo="qualquercoisa"
  return res.json({
    message: `${jogo} esse jogo é muito legal.`
  });
});

//O método abaixo(QUERY PARAMS) com DESESTRUTURAÇÃO FUNCIONA.
server.get('/provinha',  ChecarSeUsuarioExisteNoArray, (req, res) => {
  const { joguinho } = req.query;// { joguinho } <-- DESESTRUTURAÇÃO

  return res.json({
    message: `Esse joguinho do ${joguinho} é muito legal!`
  });
});

//A DESESTRUTURAÇÃO no método abaixo (Route Params) FUNCIONA 
server.get('/teclado/:numerao', ChecarSeUsuarioExisteNoArray, (req, res) => {
  const { numerao } = req.params; // { numerao } <-- DESESTRUTURAÇÃO
  return res.json({
    message: `Você digitou no Route Params o número = ${numerao}`
  });
})
//SERVIDOR precisa escutar alguma PORTA
server.listen(3000);//Escolhi a PORTA 3000, ou seja localhost:3000