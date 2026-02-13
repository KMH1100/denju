'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface University {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Material {
  id: string
  title: string
  overview: string
  priceWeb: number
  pricePdf: number
  thumbnailUrl?: string
  seller: {
    username: string
    verifiedGpa: number
  }
  course: {
    name: string
    department: {
      name: string
      university: {
        name: string
      }
    }
  }
}

export function MaterialSearchPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  
  const [selectedUniversityId, setSelectedUniversityId] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUniversities()
    fetchMaterials()
  }, [])

  useEffect(() => {
    if (selectedUniversityId) {
      fetchDepartments(selectedUniversityId)
      setSelectedDepartmentId('')
      setSelectedCourseId('')
    }
  }, [selectedUniversityId])

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchCourses(selectedDepartmentId)
      setSelectedCourseId('')
    }
  }, [selectedDepartmentId])

  useEffect(() => {
    fetchMaterials()
  }, [selectedCourseId])

  async function fetchUniversities() {
    const res = await fetch('/api/universities')
    const data = await res.json()
    setUniversities(data)
  }

  async function fetchDepartments(universityId: string) {
    const res = await fetch(`/api/departments?universityId=${universityId}`)
    const data = await res.json()
    setDepartments(data)
  }

  async function fetchCourses(departmentId: string) {
    const res = await fetch(`/api/courses?departmentId=${departmentId}`)
    const data = await res.json()
    setCourses(data)
  }

  async function fetchMaterials() {
    let url = '/api/materials?status=APPROVED'
    if (selectedCourseId) {
      url += `&courseId=${selectedCourseId}`
    }
    
    const res = await fetch(url)
    const data = await res.json()
    setMaterials(data)
  }

  const filteredMaterials = materials.filter(material => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      material.title.toLowerCase().includes(query) ||
      material.overview.toLowerCase().includes(query) ||
      material.course.name.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          ノートを探す
        </h1>
        <p className="text-center text-gray-600 mb-8">あなたにぴったりの試験対策ノートが見つかる</p>

        {/* 検索フィルター */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-sm text-gray-700">大学</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={selectedUniversityId}
                onChange={(e) => setSelectedUniversityId(e.target.value)}
              >
                <option value="">すべて</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
            </div>

            {selectedUniversityId && (
              <div>
                <label className="block font-semibold mb-2 text-sm text-gray-700">学部</label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                >
                  <option value="">すべて</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedDepartmentId && (
              <div>
                <label className="block font-semibold mb-2 text-sm text-gray-700">講義</label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">すべて</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-2 text-sm text-gray-700">キーワード検索</label>
              <input
                type="text"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="タイトルや内容で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 資料一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <Link key={material.id} href={`/materials/${material.id}`}>
              <Card hoverable className="h-full">
                {material.thumbnailUrl && (
                  <img
                    src={material.thumbnailUrl}
                    alt={material.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="mb-2">
                  <Badge variant={material.seller.verifiedGpa >= 3.3 ? 'gold' : 'silver'}>
                    GPA {material.seller.verifiedGpa}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-800">{material.title}</h3>
                
                <p className="text-xs text-gray-500 mb-1">
                  {material.course.department.university.name}
                </p>
                
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {material.course.department.name} - {material.course.name}
                </p>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {material.overview}
                </p>

                <div className="flex gap-3 text-sm font-semibold text-gray-700">
                  <span className="text-primary-600">Web: ¥{material.priceWeb.toLocaleString()}</span>
                  <span className="text-secondary-600">PDF: ¥{material.pricePdf.toLocaleString()}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card>
            <p className="text-center text-gray-500">該当するノートが見つかりませんでした</p>
          </Card>
        )}
      </div>
    </div>
  )
}
