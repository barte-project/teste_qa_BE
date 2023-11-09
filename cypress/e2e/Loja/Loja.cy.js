let r
let url = Cypress.config('baseurl')
let msgLojaDuplicada = '[{"code":"BAR-0001","title":"Erro no fluxo do vendedor","description":"O vendedor 26439100000102 já existe no nosso banco de dados"}]'
let msgSemCNPJ = '{"errors":[{"code":"BAR-0500","title":"Parametrôs de requisição inválidos","description":"A requisição está com formato inválido no campo cnpj - não deve estar em branco"}],"metadata":{"totalRecords":1,"totalPages":1,"requestDatetime":"2023-11-08T19:27:21Z"}}'

let dt_loja1
let dt_loja
let msg
let NomeLoja
let EmailLoja
let create_array = (total, numero) => Array.from(Array(total), () => number_random(numero));
let number_random = (number) => (Math.round(Math.random() * number));
let mod = (dividendo, divisor) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));




function cnpj() {
  let total_array = 8;
  let n = 9;
  let [n1, n2, n3, n4, n5, n6, n7, n8] = create_array(total_array, n);
  let n9 = 0;
  let n10 = 0;
  let n11 = 0;
  let n12 = 1;
  let r_cnpj

  let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
  d1 = 11 - (mod(d1, 11));
  if (d1 >= 10) d1 = 0;

  let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
  d2 = 11 - (mod(d2, 11));
  if (d2 >= 10) d2 = 0;
  r_cnpj = (`${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`)
  return (r_cnpj);
  ;
}



function geraStringAleatoria(tamanho) {
  var stringAleatoria = '';
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < tamanho; i++) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}



describe('Cadastrar loja', () => {

 NomeLoja = "Loja_"+ geraStringAleatoria(6)
 EmailLoja =  NomeLoja + "@email.com" 
  before(() => {
    
    
    
    cy.fixture('loja.json').then(dt_loja => {
      dt_loja1 = dt_loja;
    })
  })


  it('Cadastrar Loja', () => {

    cy.api({
      method: 'POST',
      url: url + 'service/core/public/sellers',
      body:{
        "cnpj": cnpj(),
        "companyName": NomeLoja,
        "domainUrl": "barte.com",
        "userAdmin": {
          "email": EmailLoja,
          "password": "123456789"
        },
        "acceptTerm": {
          "ip": "170.254.145.197",
          "dateTime": "2023-06-19T16:42:42.679Z",
          "userTerms": true,
          "cookiePolicy": true,
          "privacyPolicy": true
        }} ,


        headers: {

          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozi lla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
        },


        failOnStatusCode: false,
      }).then(Response => {

        cy.log(JSON.stringify(Response.body))
        expect(Response.status).to.eq(204)

      })

  })



  
  it('Login Loja', () => {


    cy.api({
      method: 'POST',
      url: url + 'service/core/public/auth/sign-in',


      body:{
        "email": EmailLoja,
        "pass": "123456789"
    },

      headers: {

        'accept': 'text/plain',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozi lla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
      },


      failOnStatusCode: false,
    }).then(Response => {


      expect(Response.status).to.eq(200)

    })

  })


  

  it('Loja Duplicada', () => {

    cy.api({
      method: 'POST',
      url: url + 'service/core/public/sellers',
      body: dt_loja1['Loja_Duplicada'],

      headers: {

        'accept': 'text/plain',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozi lla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
      },


      failOnStatusCode: false,
    }).then(Response => {
      msg = (JSON.stringify(Response.body['errors']))
      assert(msg, msgLojaDuplicada)
      expect(Response.status).to.eq(400)

    })

  })

  it('Loja Sem CNPJ', () => {

    cy.api({
      method: 'POST',
      url: url + 'service/core/public/sellers',
      body: dt_loja1['Loja_Sem_CNPJ'],

      headers: {

        'accept': 'text/plain',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozi lla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
      },


      failOnStatusCode: false,
    }).then(Response => {

      msg = (JSON.stringify(Response.body['errors']))
      cy.log(JSON.stringify(Response.body))
      assert(msg, msgSemCNPJ)
      expect(Response.status).to.eq(400)

    })

  })


})

