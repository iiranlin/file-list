import { NextRequest, NextResponse } from 'next/server'
import { audioService } from '@/lib/db/services'

export async function GET() {
  try {
    const data = await audioService.getAll()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to load audio data:', error)
    return NextResponse.json({ error: 'Failed to load audio data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newItem = await audioService.create({
      title: body.title,
      artist: body.artist,
      duration: body.duration,
      genre: body.genre,
      src: body.src,
      description: body.description,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create audio item:', error)
    return NextResponse.json({ error: 'Failed to create audio item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updatedItem = await audioService.update(body.id, {
      title: body.title,
      artist: body.artist,
      duration: body.duration,
      genre: body.genre,
      src: body.src,
      description: body.description,
    })

    if (!updatedItem) {
      return NextResponse.json({ error: 'Audio item not found' }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Failed to update audio item:', error)
    return NextResponse.json({ error: 'Failed to update audio item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const deletedItem = await audioService.delete(id)

    if (!deletedItem) {
      return NextResponse.json({ error: 'Audio item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete audio item:', error)
    return NextResponse.json({ error: 'Failed to delete audio item' }, { status: 500 })
  }
}
