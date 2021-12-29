import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const products = [
  {
      title: 'prod1',
      price: 4500,
      thumbnail: 'url1',
      stock: 50,
  },
  {
      title: 'prod2',
      price: 3100,
      thumbnail: 'url2',
      stock: 50,
  },
]

const router = new Router();
router
  .get('/', (ctx: any)=>{
    ctx.response.body = products;
  })

  .get('/:title', (ctx: any)=>{
    const product = products.filter((prod)=>{
      if (prod.title === ctx.params.title) {
          return true
      }
    });

    if (product.length) {
        ctx.response.body = product[0]
    } else {
        ctx.response.status = 404
        ctx.response.body = {
            status: 'error!',
            message: 'Producto no encontrado'
        }
    }
  })

  .post('/', async (ctx: any)=>{
    const body = ctx.request.body({type: "json"});
    const { title, price, thumbnail, stock } = await body.value;

    if ( !title || !price || !thumbnail || !stock ) {
      ctx.response.status = 400,
      ctx.response.body = {
          status: 'error',
          message: 'Ingrese toda la data',
      }
    } else {
      const newProduct = products.push({
        title,
        price,
        thumbnail,
        stock
      });
      ctx.response.status = 201,
      ctx.response.body = {
          status: 'success',
          message: `Producto creado`,
      };
    }
  })

  .put('/:title', async (ctx: any)=>{
    const body = ctx.request.body({type: "json"});
    const { title, price, thumbnail, stock } = await body.value;

    if ( !title || !price || !thumbnail || !stock ) {
      ctx.response.status = 400
      ctx.response.body = {
          status: 'error',
          message: 'Ingrese toda la data'
      }
    } else {
      const param = ctx.params.title
      const index = products.findIndex(prod => prod.title === param)
      const newData = {title, price, thumbnail, stock}

      products.splice(index, 1, newData)

      ctx.response.status = 201
      ctx.response.body = {
          status: 'success',
          message: 'Producto actualizado'
      }
    }
  })
  
  .delete('/:title', (ctx: any)=>{
    const title = ctx.params.title
    const index = products.findIndex(prod => prod.title === title)
    products.splice(index, 1)

    ctx.response.status = 200
    ctx.response.body = {
        status: 'success',
        message: 'Producto eliminado'
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });