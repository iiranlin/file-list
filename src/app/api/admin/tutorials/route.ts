import { NextRequest, NextResponse } from 'next/server'
import { loadTutorialData, type Tutorial } from '@/lib/data-loader'
import { saveTutorialData, generateNewId } from '@/lib/data-manager'

export async function GET() {
  try {
    const data = await loadTutorialData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load tutorial data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadTutorialData()
    
    const newItem: Tutorial = {
      ...body,
      id: generateNewId(currentData),
      tags: Array.isArray(body.tags) ? body.tags : body.tags.split(',').map((tag: string) => tag.trim())
    }
    
    const updatedData = [...currentData, newItem]
    await saveTutorialData(updatedData)
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tutorial item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadTutorialData()
    
    const updatedItem = {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : body.tags.split(',').map((tag: string) => tag.trim())
    }
    
    const updatedData = currentData.map(item => 
      item.id === body.id ? { ...item, ...updatedItem } : item
    )
    
    await saveTutorialData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tutorial item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const currentData = await loadTutorialData()
    const updatedData = currentData.filter(item => item.id !== id)
    
    await saveTutorialData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tutorial item' }, { status: 500 })
  }
}
