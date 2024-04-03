import { HatchifyProvider, hatchifyReact } from '@hatchifyjs/react'
import { createTheme, ThemeProvider } from '@mui/material'
import { type ActionFunctionArgs,json, type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Schemas } from '~/utils/schemas.mjs'

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { search } = new URL(request.url)

  const todos = await context.hatchify.everything.Todo.findAndCountAll(
    search.split('?')[1] ?? '',
  )

  return json({ todos })
}

export async function action({ context }: ActionFunctionArgs) {
  const user = await context.hatchify.orm.models.User.create({ name: 'Roye' })
  await context.hatchify.orm.models.Todo.create({ name: 'Integrating Remix', userId: user.id })
  return redirect('/todos')
}

export default function Todos() {
  const data = useLoaderData<typeof loader>()

  const hatchedReact = hatchifyReact({
    completeSchemaMap: Schemas,
    version: 0,
    findAll: () =>
      Promise.resolve([
        {
          records: data.todos.data.map((row: any) => ({
            ...row,
            __schema: 'Todo',
          })),
          related: [],
        },
        data.todos.meta,
      ]),
    findOne: () => Promise.resolve({ record: {} as any, related: [] }),
    createOne: () => Promise.resolve({ record: {} as any, related: [] }),
    updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
    deleteOne: () => Promise.resolve(),
  })

  const DataGrid = hatchedReact.components.Todo.DataGrid

  return (
    <>
      <div className="m-8">
        <Form method="post">
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-white"
            type="submit"
          >
            Count: {data.todos.meta.unpaginatedCount}
          </button>
        </Form>
      </div>
      <ThemeProvider theme={createTheme()}>
        <HatchifyProvider>
          <DataGrid />
        </HatchifyProvider>
      </ThemeProvider>
    </>
  )
}
