import { NextRequest, NextResponse } from 'next/server'
import { loadVideoData, type VideoFile } from '@/lib/data-loader'
import { saveVideoData, generateNewId } from '@/lib/data-manager'

export async function GET() {
  try {
    const data = await loadVideoData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load video data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadVideoData()
    
    const newItem: VideoFile = {
      ...body,
      id: generateNewId(currentData)
    }
    
    const updatedData = [...currentData, newItem]
    await saveVideoData(updatedData)
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create video item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadVideoData()
    
    const updatedData = currentData.map(item => 
      item.id === body.id ? { ...item, ...body } : item
    )
    
    await saveVideoData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const currentData = await loadVideoData()
    const updatedData = currentData.filter(item => item.id !== id)
    
    await saveVideoData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video item' }, { status: 500 })
  }
}
