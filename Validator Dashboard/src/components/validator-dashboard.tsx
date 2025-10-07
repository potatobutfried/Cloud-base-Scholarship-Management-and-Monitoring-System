import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Progress } from "./ui/progress"
import { Users, CheckCircle, XCircle, Clock, MessageSquare, History, FileText, Mail, GraduationCap, Calendar, ArrowLeft, ArrowRight, Menu, Eye, RotateCcw, Trash2, AlertCircle } from "lucide-react"

interface Applicant {
  id: string
  name: string
  email: string
  course: string
  yearLevel: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  rejectionReason?: string
  rejectionCategory?: string
  invalidDocuments?: string[]
  documents: string[]
  profileImage?: string
  previouslyRejected?: boolean
  rejectionHistory?: { reason: string; category: string; date: string; invalidDocuments?: string[] }[]
  missingRequirements?: string[]
  hasSubmittedMissingDocs?: boolean
}

const initialApplicants: Applicant[] = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    course: "Computer Science",
    yearLevel: "3rd Year",
    status: "pending",
    appliedDate: "2024-01-15",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "2",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    course: "Engineering",
    yearLevel: "2nd Year",
    status: "approved",
    appliedDate: "2024-01-12",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "3",
    name: "Ana Reyes",
    email: "ana.reyes@email.com",
    course: "Medicine",
    yearLevel: "4th Year",
    status: "pending",
    appliedDate: "2024-01-18",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "4",
    name: "Carlos Garcia",
    email: "carlos.garcia@email.com",
    course: "Business",
    yearLevel: "1st Year",
    status: "pending",
    appliedDate: "2024-01-10",
    previouslyRejected: true,
    missingRequirements: ["Gradeslip", "Certificate of Enrollment"],
    hasSubmittedMissingDocs: true,
    rejectionHistory: [{
      reason: "Reason: Invalid documents",
      category: "Invalid Documents",
      date: "2024-01-11",
      invalidDocuments: ["Gradeslip", "Certificate of Enrollment"]
    }],
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "5",
    name: "Sofia Rodriguez",
    email: "sofia.rodriguez@email.com",
    course: "Law",
    yearLevel: "3rd Year",
    status: "pending",
    appliedDate: "2024-01-20",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "6",
    name: "Miguel Torres",
    email: "miguel.torres@email.com",
    course: "Architecture",
    yearLevel: "2nd Year",
    status: "pending",
    appliedDate: "2024-01-08",
    previouslyRejected: true,
    missingRequirements: ["Certificate of Completion"],
    hasSubmittedMissingDocs: false,
    rejectionHistory: [{
      reason: "Reason: Not qualified renewal",
      category: "Not Qualified Renewal", 
      date: "2024-01-09"
    }],
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "7",
    name: "Isabella Cruz",
    email: "isabella.cruz@email.com",
    course: "Psychology",
    yearLevel: "4th Year",
    status: "pending",
    appliedDate: "2024-01-22",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  },
  {
    id: "8",
    name: "Gabriel Torres",
    email: "gabriel.torres@email.com",
    course: "Information Technology",
    yearLevel: "1st Year",
    status: "pending",
    appliedDate: "2024-01-25",
    documents: ["Gradeslip", "Certificate of Enrollment", "Certificate of Completion"]
  }
]

export function ValidatorDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionCategory, setRejectionCategory] = useState("")
  const [invalidDocuments, setInvalidDocuments] = useState<string[]>([])
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected" | null>(null)
  const [showListView, setShowListView] = useState(false)

  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === "pending").length,
    approved: applicants.filter(a => a.status === "approved").length,
    rejected: applicants.filter(a => a.status === "rejected").length
  }

  const pendingApplicants = applicants.filter(a => a.status === "pending")
  const currentApplicant = pendingApplicants[currentIndex]

  const handleApprove = () => {
    if (currentApplicant) {
      setApplicants(prev => 
        prev.map(applicant => 
          applicant.id === currentApplicant.id 
            ? { ...applicant, status: "approved" as const }
            : applicant
        )
      )
      navigateNext()
    }
  }

  const handleReject = () => {
    if (currentApplicant) {
      setSelectedApplicant(currentApplicant)
      setRejectionReason("")
      setRejectionCategory("")
      setInvalidDocuments([])
      setIsRejectDialogOpen(true)
    }
  }

  const confirmReject = () => {
    if (selectedApplicant && rejectionCategory && (rejectionReason.trim() || invalidDocuments.length > 0)) {
      const finalReason = rejectionCategory === "Invalid Documents" 
        ? `Reason: Invalid documents - ${invalidDocuments.join(", ")}`
        : `Reason: ${rejectionReason.trim()}`
      
      // Automatically move to pending status with rejection history
      setApplicants(prev =>
        prev.map(applicant =>
          applicant.id === selectedApplicant.id
            ? { 
                ...applicant, 
                status: "pending" as const,
                previouslyRejected: true,
                missingRequirements: rejectionCategory === "Invalid Documents" ? invalidDocuments : undefined,
                hasSubmittedMissingDocs: false,
                rejectionHistory: [
                  ...(applicant.rejectionHistory || []),
                  {
                    reason: finalReason,
                    category: rejectionCategory,
                    date: new Date().toISOString(),
                    invalidDocuments: rejectionCategory === "Invalid Documents" ? invalidDocuments : undefined
                  }
                ],
                rejectionReason: undefined,
                rejectionCategory: undefined,
                invalidDocuments: undefined
              }
            : applicant
        )
      )
      setIsRejectDialogOpen(false)
      setSelectedApplicant(null)
      setRejectionReason("")
      setRejectionCategory("")
      setInvalidDocuments([])
      navigateNext()
    }
  }

  const navigateNext = () => {
    if (currentIndex < pendingApplicants.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(pendingApplicants.length - 1)
    }
  }

  const handleDocumentToggle = (document: string) => {
    setInvalidDocuments(prev => 
      prev.includes(document) 
        ? prev.filter(doc => doc !== document)
        : [...prev, document]
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleCardClick = (filter: "all" | "pending" | "approved" | "rejected") => {
    setActiveFilter(filter)
    setShowListView(true)
  }

  const getFilteredApplicants = () => {
    if (!activeFilter || activeFilter === "all") return applicants
    return applicants.filter(applicant => applicant.status === activeFilter)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    }
  }

  const backToValidator = () => {
    setShowListView(false)
    setActiveFilter(null)
  }

  const handleDeleteApplicant = (applicantId: string) => {
    setApplicants(prev => prev.filter(applicant => applicant.id !== applicantId))
  }

  const handleMarkMissingDocsSubmitted = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === applicantId
          ? { ...applicant, hasSubmittedMissingDocs: true }
          : applicant
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Validator Dashboard</h1>
                <p className="text-sm text-muted-foreground">Review and validate scholarship applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsHistoryDialogOpen(true)}>
                <History className="h-4 w-4 mr-2" />
                Validation History
              </Button>
              <div className="text-sm text-muted-foreground">
                Available Slot: {stats.total}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform transition-transform"
            onClick={() => handleCardClick("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Applications</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Applications received</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform transition-transform"
            onClick={() => handleCardClick("pending")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting validation</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform transition-transform"
            onClick={() => handleCardClick("approved")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Successfully validated</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform transition-transform"
            onClick={() => handleCardClick("rejected")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Rejected</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Did not meet criteria</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {showListView ? (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={backToValidator}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Validator
                  </Button>
                  <div>
                    <CardTitle className="capitalize">
                      {activeFilter === "all" ? "All Applications" : `${activeFilter} Applications`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getFilteredApplicants().length} applications found
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Year Level</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredApplicants().map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                              {getInitials(applicant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{applicant.name}</p>
                            <p className="text-xs text-muted-foreground">{applicant.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{applicant.course}</TableCell>
                      <TableCell>{applicant.yearLevel}</TableCell>
                      <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {applicant.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove()}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteApplicant(applicant.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              {applicant.previouslyRejected && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                                      <History className="h-4 w-4 mr-1" />
                                      View History
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Rejection History & Missing Requirements</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block mb-2">Applicant:</label>
                                        <p>{applicant.name}</p>
                                      </div>
                                      {applicant.missingRequirements && applicant.missingRequirements.length > 0 && (
                                        <div>
                                          <label className="block mb-2">Missing Requirements:</label>
                                          <div className="space-y-2">
                                            {applicant.missingRequirements.map((doc, index) => (
                                              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                                                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                                  {doc}
                                                </Badge>
                                                {applicant.hasSubmittedMissingDocs ? (
                                                  <Badge className="bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Submitted
                                                  </Badge>
                                                ) : (
                                                  <Badge variant="destructive">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Pending
                                                  </Badge>
                                                )}
                                              </div>
                                            ))}
                                            {!applicant.hasSubmittedMissingDocs && (
                                              <Button
                                                size="sm"
                                                onClick={() => handleMarkMissingDocsSubmitted(applicant.id)}
                                                className="mt-2"
                                              >
                                                Mark as Submitted
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {applicant.rejectionHistory && applicant.rejectionHistory.length > 0 && (
                                        <div>
                                          <label className="block mb-2">Previous Rejections:</label>
                                          <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {applicant.rejectionHistory.map((history, index) => (
                                              <div key={index} className="p-3 bg-red-50 rounded-md border-l-4 border-red-500">
                                                <p className="text-sm"><span className="font-medium">Category:</span> {history.category}</p>
                                                <p className="text-sm"><span className="font-medium">Reason:</span> {history.reason}</p>
                                                <p className="text-xs text-muted-foreground">Rejected on: {new Date(history.date).toLocaleDateString()}</p>
                                                {history.invalidDocuments && history.invalidDocuments.length > 0 && (
                                                  <div className="mt-2">
                                                    <span className="text-xs text-muted-foreground">Invalid Documents: </span>
                                                    {history.invalidDocuments.map((doc, docIndex) => (
                                                      <Badge key={docIndex} variant="destructive" className="mr-1 text-xs">
                                                        {doc}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          /* Main Validation Interface */
          currentApplicant ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Applicant Card */}
              <Card className="bg-white shadow-lg">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigatePrevious}
                      disabled={pendingApplicants.length <= 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        Remaining Applications: {stats.pending}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateNext}
                      disabled={pendingApplicants.length <= 1}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                        {getInitials(currentApplicant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl mb-2">APPLICANT NO. {currentApplicant.id}</h2>
                      <div className="bg-blue-600 text-white py-3 px-6 rounded-lg inline-block">
                        <h3 className="text-lg">{currentApplicant.name}</h3>
                      </div>
                      {currentApplicant.previouslyRejected && (
                        <div className="mt-3 space-y-2">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Previously Rejected - Under Re-review
                          </Badge>
                          {currentApplicant.missingRequirements && currentApplicant.missingRequirements.length > 0 && (
                            <div>
                              <Badge variant="outline" className={`${currentApplicant.hasSubmittedMissingDocs ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {currentApplicant.hasSubmittedMissingDocs ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Missing Docs Submitted
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Missing Docs Pending
                                  </>
                                )}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{currentApplicant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Course</p>
                        <p className="text-sm">{currentApplicant.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Year Level</p>
                        <p className="text-sm">{currentApplicant.yearLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Applied Date</p>
                        <p className="text-sm">{new Date(currentApplicant.appliedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Missing Requirements Status */}
                  {currentApplicant.previouslyRejected && currentApplicant.missingRequirements && currentApplicant.missingRequirements.length > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="text-sm text-yellow-800 mb-3 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Missing Requirements Status
                      </h4>
                      <div className="space-y-2">
                        {currentApplicant.missingRequirements.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-yellow-700">{doc}</span>
                            <Badge variant={currentApplicant.hasSubmittedMissingDocs ? "default" : "destructive"} className="text-xs">
                              {currentApplicant.hasSubmittedMissingDocs ? "Submitted" : "Pending"}
                            </Badge>
                          </div>
                        ))}
                        {!currentApplicant.hasSubmittedMissingDocs && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkMissingDocsSubmitted(currentApplicant.id)}
                            className="mt-2 w-full"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Documents as Submitted
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejection History for Previously Rejected Applicants */}
                  {currentApplicant.previouslyRejected && currentApplicant.rejectionHistory && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="text-sm text-orange-800 mb-2 flex items-center">
                        <History className="h-4 w-4 mr-2" />
                        Previous Rejection History
                      </h4>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {currentApplicant.rejectionHistory.map((history, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium text-orange-700">{history.category}:</span>
                            <span className="text-orange-600 ml-1">{history.reason}</span>
                            <span className="text-orange-500 ml-2">({new Date(history.date).toLocaleDateString()})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span>{currentIndex + 1} of {pendingApplicants.length}</span>
                    </div>
                    <Progress value={((currentIndex + 1) / pendingApplicants.length) * 100} className="h-2" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={handleApprove}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      APPROVE
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="destructive" 
                      className="flex-1 py-3"
                      size="lg"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      REJECT
                    </Button>
                    <Button 
                      onClick={() => handleDeleteApplicant(currentApplicant.id)}
                      variant="outline"
                      className="py-3 px-4 border-red-200 text-red-600 hover:bg-red-50"
                      size="lg"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      DELETE
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Panel */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentApplicant.documents.map((document, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm">{document}</p>
                            <p className="text-xs text-muted-foreground">Submitted</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-white shadow-lg">
              <CardContent className="text-center py-16">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl mb-2">All Applications Reviewed</h3>
                <p className="text-muted-foreground">You have completed validation for all pending applications.</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Validation History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Your Validation History</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <h4 className="mb-4 text-green-600">Accepted Applications</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {applicants.filter(a => a.status === "approved").map((applicant) => (
                  <div key={applicant.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm">{applicant.name}</p>
                    <p className="text-xs text-muted-foreground">{applicant.course}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-red-600">Rejected Applications</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {applicants.filter(a => a.status === "rejected").map((applicant) => (
                  <div key={applicant.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm">{applicant.name}</p>
                    <p className="text-xs text-muted-foreground">{applicant.course}</p>
                    {applicant.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">{applicant.rejectionReason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Invalid Documents:</label>
                <div className="space-y-2">
                  {selectedApplicant?.documents.map((document) => (
                    <div key={document} className="flex items-center space-x-2">
                      <Checkbox
                        id={document}
                        checked={invalidDocuments.includes(document)}
                        onCheckedChange={() => handleDocumentToggle(document)}
                      />
                      <label htmlFor={document} className="text-sm cursor-pointer">
                        {document}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Rejection Category:</label>
                <Select value={rejectionCategory} onValueChange={setRejectionCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rejection category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Invalid Documents">Invalid Documents</SelectItem>
                    <SelectItem value="Not Qualified Renewal">Not Qualified Renewal</SelectItem>
                    <SelectItem value="Incomplete Application">Incomplete Application</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rejectionCategory && rejectionCategory !== "Invalid Documents" && (
                <div>
                  <label className="text-sm mb-2 block">Remarks (Reason for rejection, required):</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a detailed reason for the rejection..."
                    rows={4}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReject}
                disabled={!rejectionCategory || (rejectionCategory !== "Invalid Documents" && !rejectionReason.trim()) || (rejectionCategory === "Invalid Documents" && invalidDocuments.length === 0)}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}