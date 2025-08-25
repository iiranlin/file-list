import { NextRequest, NextResponse } from 'next/server'
import { videoService } from '@/lib/db/services'

export async function GET() {
  try {
    const data = await videoService.getAll()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to load video data:', error)
    return NextResponse.json({ error: 'Failed to load video data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newItem = await videoService.create({
      title: body.title,
      description: body.description,
      duration: body.duration,
      category: body.category,
      thumbnail: body.thumbnail,
      src: body.src,
      views: body.views,
      uploadDate: body.uploadDate,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create video item:', error)
    return NextResponse.json({ error: 'Failed to create video item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updatedItem = await videoService.update(body.id, {
      title: body.title,
      description: body.description,
      duration: body.duration,
      category: body.category,
      thumbnail: body.thumbnail,
      src: body.src,
      views: body.views,
      uploadDate: body.uploadDate,
    })

    if (!updatedItem) {
      return NextResponse.json({ error: 'Video item not found' }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Failed to update video item:', error)
    return NextResponse.json({ error: 'Failed to update video item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const deletedItem = await videoService.delete(id)

    if (!deletedItem) {
      return NextResponse.json({ error: 'Video item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete video item:', error)
    return NextResponse.json({ error: 'Failed to delete video item' }, { status: 500 })
  }
}
