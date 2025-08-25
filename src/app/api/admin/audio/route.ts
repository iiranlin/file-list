import { NextRequest, NextResponse } from 'next/server'
import { loadAudioData, type AudioFile } from '@/lib/data-loader'
import { saveAudioData, generateNewId } from '@/lib/data-manager'

export async function GET() {
  try {
    const data = await loadAudioData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load audio data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadAudioData()
    
    const newItem: AudioFile = {
      ...body,
      id: generateNewId(currentData)
    }
    
    const updatedData = [...currentData, newItem]
    await saveAudioData(updatedData)
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create audio item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const currentData = await loadAudioData()
    
    const updatedData = currentData.map(item => 
      item.id === body.id ? { ...item, ...body } : item
    )
    
    await saveAudioData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update audio item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const currentData = await loadAudioData()
    const updatedData = currentData.filter(item => item.id !== id)
    
    await saveAudioData(updatedData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete audio item' }, { status: 500 })
  }
}
