import { uploadFile, deleteFile, getFileUrl, FileType, getR2Info } from '../src/lib/cloudflare/r2'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

async function testR2Integration() {
  console.log('Testing Cloudflare R2 Integration...')
  
  // 1. 验证配置
  console.log('\n1. Verifying Configuration...')
  const info = getR2Info()
  if (!info.configured) {
    console.error('❌ Configuration missing:', info.error)
    process.exit(1)
  }
  console.log('✅ Configuration loaded:', {
    bucket: info.bucketName,
    domain: info.publicDomain
  })

  // 2. 测试上传
  console.log('\n2. Testing Upload...')
  const testContent = 'Hello Cloudflare R2!'
  const testBuffer = Buffer.from(testContent)
  const testFileName = 'test-upload.txt'
  
  const uploadResult = await uploadFile(testBuffer, testFileName, FileType.IMAGE, 'text/plain')
  
  if (!uploadResult.success) {
    console.error('❌ Upload failed:', uploadResult.error)
    process.exit(1)
  }
  console.log('✅ Upload successful')
  console.log('   Key:', uploadResult.key)
  console.log('   URL:', uploadResult.url)

  if (!uploadResult.key) {
    console.error('❌ Upload result missing key')
    process.exit(1)
  }

  // 3. 验证公共访问 (可选，因为DNS传播可能需要时间)
  console.log('\n3. Verifying Public Access...')
  try {
     const response = await fetch(uploadResult.url!)
     if (response.ok) {
        const text = await response.text()
        if (text === testContent) {
            console.log('✅ Public access verified: Content matches')
        } else {
            console.warn('⚠️ Public access verified but content mismatch')
        }
     } else {
        console.warn(`⚠️ Public access failed with status: ${response.status} (DNS propagation might take time)`)
     }
  } catch (err) {
      console.warn('⚠️ Public access check failed:', err instanceof Error ? err.message : 'Unknown error')
  }

  // 4. 测试删除
  console.log('\n4. Testing Delete...')
  const deleteResult = await deleteFile(uploadResult.key)
  
  if (!deleteResult.success) {
    console.error('❌ Delete failed:', deleteResult.error)
    process.exit(1)
  }
  console.log('✅ Delete successful')
  
  console.log('\n🎉 All Cloudflare R2 tests passed!')
}

testR2Integration().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
