import { NextRequest, NextResponse } from 'next/server'
import { loadImageData, type ImageFile } from '@/lib/data-loader'
import { saveImageData, generateNewId } from '@/lib/data-manager'

export async function GET() {
  try {
    const data = await loadImageData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load image data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadImageData()
    
    const newItem: ImageFile = {
      ...body,
      id: generateNewId(currentData),
      tags: Array.isArray(body.tags) ? body.tags : body.tags.split(',').map((tag: string) => tag.trim())
    }
    
    const updatedData = [...currentData, newItem]
    await saveImageData(updatedData)
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create image item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadImageData()
    
    const updatedItem = {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : body.tags.split(',').map((tag: string) => tag.trim())
    }
    
    const updatedData = currentData.map(item => 
      item.id === body.id ? { ...item, ...updatedItem } : item
    )
    
    await saveImageData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update image item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const currentData = await loadImageData()
    const updatedData = currentData.filter(item => item.id !== id)
    
    await saveImageData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image item' }, { status: 500 })
  }
}
