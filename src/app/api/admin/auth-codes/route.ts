import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/db/services'

export async function GET() {
  try {
    const data = await authService.getAll()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to load auth codes:', error)
    return NextResponse.json({ error: 'Failed to load auth codes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newItem = await authService.create({
      userName: body.userName,
      userCode: body.userCode,
      systemCode: body.systemCode,
      isActive: body.isActive ?? 1,
    })
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create auth code:', error)
    return NextResponse.json({ error: 'Failed to create auth code' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const updatedItem = await authService.update(body.id, {
      userName: body.userName,
      userCode: body.userCode,
      systemCode: body.systemCode,
      isActive: body.isActive,
    })
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Auth code not found' }, { status: 404 })
    }
    
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Failed to update auth code:', error)
    return NextResponse.json({ error: 'Failed to update auth code' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const deletedItem = await authService.delete(id)
    
    if (!deletedItem) {
      return NextResponse.json({ error: 'Auth code not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete auth code:', error)
    return NextResponse.json({ error: 'Failed to delete auth code' }, { status: 500 })
  }
}
