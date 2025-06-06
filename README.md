# Rest API em memória com Nestjs

Esse projeto é um pequeno projeto para aprendizagem do framework Nestjs, ele é baseado num desafio técnico presente no seguinte repositório do github: https://github.com/PicPay/picpay-desafio-backend.

## Porque usar memória ao invés de um banco de dados?

A decisão de até o momento seguir desenvolvendo o mesmo em memória e não com um banco de dados tradicional é apenas por praticidade, mas em um determinado momento pretendo implantar um banco de dados, usar um ORM como TypeORM ou Prisma e implementar migrations.

## Como testar o projeto

Para testar o projeto, basta fazer o download dos arquivos e executar:
```bash
npm install
```

Depois, crie uma variável de ambiente denomidada "SECRET" ou crie um arquivo .env na raiz e crie uma variável SECRET dentro dele, como por exemplo:
```
# project-root/.env
SECRET=PUT YOUR SECRET HERE
```

Após isso, as dependencias serão baixadas e após o término execute o comando para iniciar o servidor web local:
```bash
npm run start
```

Por fim, basta testar a aplicação por meio da interface do swagger disponibilizada com o endpoint: /api, ou usar uma ferramenta de testes de api de sua preferência, como por exemplo: Postman
