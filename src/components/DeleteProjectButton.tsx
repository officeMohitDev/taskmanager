import db from '@/db/db'
import { Button } from '@nextui-org/button'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import React from 'react'

const DeleteProjectButton = ({id}: {id: string}) => {
  return (
    <form action={async() => {
        "use server"
        await db.project.delete({where: {id: id}})
        revalidatePath("/projects")
        redirect("/projects")
    }}>
    <Button color='danger' type='submit' className='w-full'>Delete Project</Button>
    </form>
  )
}

export default DeleteProjectButton