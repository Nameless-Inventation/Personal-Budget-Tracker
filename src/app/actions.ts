'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const description = formData.get('description') as string
  const amountStr = formData.get('amount') as string
  const categoryName = formData.get('category') as string
  const type = formData.get('type') as string
  const date = formData.get('date') as string

  const amount = Math.abs(parseFloat(amountStr))

  // Find or create category
  let categoryId = null;
  const { data: cats } = await supabase.from('categories').select('id').eq('name', categoryName).eq('type', type).single()
  
  if (cats) {
    categoryId = cats.id
  } else {
    const { data: newCat } = await supabase.from('categories').insert({
      user_id: user.id,
      name: categoryName,
      type: type,
      color: '#3b82f6'
    }).select().single()
    if (newCat) categoryId = newCat.id
  }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    description,
    amount,
    type,
    date,
    category_id: categoryId
  })

  if (error) console.error(error)
  revalidatePath('/transactions')
  revalidatePath('/')
}

export async function editTransaction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const description = formData.get('description') as string
  const amountStr = formData.get('amount') as string
  const categoryName = formData.get('category') as string
  const type = formData.get('type') as string
  const date = formData.get('date') as string

  const amount = Math.abs(parseFloat(amountStr))

  let categoryId = null;
  const { data: cats } = await supabase.from('categories').select('id').eq('name', categoryName).eq('type', type).single()
  
  if (cats) {
    categoryId = cats.id
  } else {
    const { data: newCat } = await supabase.from('categories').insert({
      user_id: user.id,
      name: categoryName,
      type: type,
      color: '#3b82f6'
    }).select().single()
    if (newCat) categoryId = newCat.id
  }

  const { error } = await supabase.from('transactions').update({
    description,
    amount,
    type,
    date,
    category_id: categoryId
  }).eq('id', id).eq('user_id', user.id)

  if (error) console.error(error)
  revalidatePath('/transactions')
  revalidatePath('/')
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) console.error(error)
  revalidatePath('/transactions')
  revalidatePath('/')
}
