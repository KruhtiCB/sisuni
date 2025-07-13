import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { 
  Search, 
  Upload, 
  Send, 
  Edit, 
  Trash2, 
  Download, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  User,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  linkedIn?: string;
  portfolio?: string;
  experience: string;
  skills: string;
  coverLetter: string;
  preferredRole: string;
  availability: string;
  expectedSalary?: string;
  resumeFileName?: string;
  applicationDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';
  createdAt: string;
  updatedAt: string;
}

const Career = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    experience: '',
    skills: '',
    coverLetter: '',
    preferredRole: '',
    availability: '',
    expectedSalary: '',
  });
  
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search functionality
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedApplication, setSearchedApplication] = useState<Application | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  
  // Edit functionality
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setResume(file);
      } else {
        toast.error('Please upload a PDF or DOC file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append resume if selected
      if (resume) {
        formDataToSend.append('resume', resume);
      }

      const response = await fetch('http://localhost:3001/api/applications/general', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Application submitted successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          linkedIn: '',
          portfolio: '',
          experience: '',
          skills: '',
          coverLetter: '',
          preferredRole: '',
          availability: '',
          expectedSalary: '',
        });
        setResume(null);
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchApplication = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3001/api/applications/by-email/${encodeURIComponent(searchEmail)}`);
      const result = await response.json();

      if (result.success) {
        setSearchedApplication(result.application);
        setShowApplicationDialog(true);
      } else {
        toast.error(result.message || 'Application not found');
        setSearchedApplication(null);
      }
    } catch (error) {
      console.error('Error searching application:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/applications/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Application deleted successfully');
        setShowApplicationDialog(false);
        setSearchedApplication(null);
      } else {
        toast.error(result.message || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const updateApplication = async (updatedData: Partial<Application>) => {
    if (!editingApplication) return;

    try {
      const response = await fetch(`http://localhost:3001/api/applications/${editingApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Application updated successfully');
        setSearchedApplication(result.application);
        setShowEditDialog(false);
        setEditingApplication(null);
      } else {
        toast.error(result.message || 'Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'reviewed': return <CheckCircle className="h-4 w-4" />;
      case 'interview': return <Calendar className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Join Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Be part of an innovative team that's shaping the future of technology. 
              We're looking for passionate individuals who want to make a difference.
            </p>
            
            {/* Search Application Section */}
            <div className="max-w-md mx-auto mb-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Your Application
                  </CardTitle>
                  <CardDescription>
                    Enter your email to view and manage your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={searchApplication}
                      disabled={isSearching}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Apply Now</CardTitle>
              <CardDescription className="text-lg">
                Fill out the form below to start your journey with Sisuni Tech
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                      <Input
                        id="linkedIn"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Select onValueChange={(value) => handleSelectChange('experience', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years (Fresher)</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-8">5-8 years</SelectItem>
                          <SelectItem value="8+">8+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preferredRole">Preferred Role *</Label>
                      <Select onValueChange={(value) => handleSelectChange('preferredRole', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select preferred role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                          <SelectItem value="backend-developer">Backend Developer</SelectItem>
                          <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
                          <SelectItem value="cybersecurity-specialist">Cybersecurity Specialist</SelectItem>
                          <SelectItem value="iot-engineer">IoT Engineer</SelectItem>
                          <SelectItem value="ai-ml-engineer">AI/ML Engineer</SelectItem>
                          <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                          <SelectItem value="ui-ux-designer">UI/UX Designer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability *</Label>
                      <Select onValueChange={(value) => handleSelectChange('availability', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="When can you start?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately</SelectItem>
                          <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                          <SelectItem value="1-month">1 month notice</SelectItem>
                          <SelectItem value="2-months">2 months notice</SelectItem>
                          <SelectItem value="3-months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expectedSalary">Expected Salary (LPA)</Label>
                      <Input
                        id="expectedSalary"
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        placeholder="e.g., 5-8 LPA"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="portfolio">Portfolio/Website</Label>
                      <Input
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Skills and Experience */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Skills & Experience
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="skills">Technical Skills *</Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="List your technical skills (e.g., React, Node.js, Python, AWS, etc.)"
                        required
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter *</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        placeholder="Tell us why you want to join Sisuni Tech and what makes you a great fit for this role..."
                        required
                        className="mt-1 min-h-[150px]"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Resume Upload */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Resume Upload
                  </h3>
                  <div>
                    <Label htmlFor="resume">Upload Resume (PDF/DOC)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    {resume && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {resume.name} selected
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Application Details Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Application Details</DialogTitle>
            <DialogDescription>
              View and manage your job application
            </DialogDescription>
          </DialogHeader>
          
          {searchedApplication && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(searchedApplication.status)}`}>
                  {getStatusIcon(searchedApplication.status)}
                  <span className="ml-1 capitalize">{searchedApplication.status}</span>
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingApplication(searchedApplication);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteApplication(searchedApplication._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{searchedApplication.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{searchedApplication.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{searchedApplication.phone}</span>
                  </div>
                  {searchedApplication.linkedIn && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">LinkedIn:</span>
                      <a href={searchedApplication.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Profile
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">{searchedApplication.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium">Preferred Role:</span>
                    <span className="ml-2 capitalize">{searchedApplication.preferredRole.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium">Availability:</span>
                    <span className="ml-2 capitalize">{searchedApplication.availability}</span>
                  </div>
                  {searchedApplication.expectedSalary && (
                    <div>
                      <span className="font-medium">Expected Salary:</span>
                      <span className="ml-2">{searchedApplication.expectedSalary}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{searchedApplication.skills}</p>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{searchedApplication.coverLetter}</p>
                </CardContent>
              </Card>

              {/* Resume */}
              {searchedApplication.resumeFileName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <a href={`http://localhost:3001/uploads/resumes/${searchedApplication.resumeFileName}`} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Application Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Application Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Applied:</span>
                      <span className="ml-2">{new Date(searchedApplication.applicationDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <span className="ml-2">{new Date(searchedApplication.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update your application details
            </DialogDescription>
          </DialogHeader>
          
          {editingApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingApplication.name}
                    onChange={(e) => setEditingApplication({
                      ...editingApplication,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingApplication.phone}
                    onChange={(e) => setEditingApplication({
                      ...editingApplication,
                      phone: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-skills">Skills</Label>
                <Textarea
                  id="edit-skills"
                  value={editingApplication.skills}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    skills: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-cover-letter">Cover Letter</Label>
                <Textarea
                  id="edit-cover-letter"
                  value={editingApplication.coverLetter}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    coverLetter: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateApplication(editingApplication)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Career;