import { Select, SelectItem, Textarea, TextField } from '@incmix/ui/form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Lock, Mail, User } from 'lucide-react'
import * as React from 'react'
import { Label } from '@/form'
import { SemanticColor } from '@/theme/props/color.prop'

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const meta: Meta = {
  title: 'Design System/Form Examples',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const UserRegistrationForm: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      bio: '',
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [submitted, setSubmitted] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      // Simple validation
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!formData.email.includes('@')) {
        newErrors.email = 'Email must be valid'
      }
      if (!formData.password) newErrors.password = 'Password is required'
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        setSubmitted(true)
        console.log('Form submitted:', formData)
      }
    }

    if (submitted) {
      return (
        <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-4">✅ Registration Successful!</h3>
          <div className="space-y-2 text-sm text-green-700">
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Role:</strong> {formData.role || 'Not specified'}
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: '',
                bio: '',
              })
              setErrors({})
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Register Another User
          </button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-medium mb-6">User Registration</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2">First Name</Label>
            <TextField
              size="sm"
              variant="outline"
              color={errors.firstName ? SemanticColor.error : SemanticColor.slate}
              leftIcon={<User />}
              placeholder="John"
              value={formData.firstName}
              onChange={(e: InputChangeEvent) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label className="block mb-2">Last Name</Label>
            <TextField
              size="sm"
              variant="outline"
              color={errors.lastName ? SemanticColor.error : SemanticColor.slate}
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e: InputChangeEvent) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Email Address</Label>
          <TextField
            size="sm"
            variant="outline"
            color={errors.email ? SemanticColor.error : SemanticColor.info}
            leftIcon={<Mail />}
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e: InputChangeEvent) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label className="block mb-2">Password</Label>
          <TextField
            size="sm"
            variant="outline"
            color={errors.password ? SemanticColor.error : SemanticColor.slate}
            leftIcon={<Lock />}
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e: InputChangeEvent) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div>
          <Label className="block mb-2">Confirm Password</Label>
          <TextField
            size="sm"
            variant="outline"
            color={errors.confirmPassword ? SemanticColor.error : SemanticColor.slate}
            leftIcon={<Lock />}
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e: InputChangeEvent) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <div>
          <Label className="block mb-2">Role (Optional)</Label>
          <Select
            size="sm"
            variant="outline"
            color="slate"
            placeholder="Select your role"
            value={formData.role}
            onValueChange={(value: string) => setFormData({ ...formData, role: value })}
          >
            <SelectItem value="developer">Software Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="manager">Project Manager</SelectItem>
            <SelectItem value="analyst">Business Analyst</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </Select>
        </div>

        <div>
          <Label className="block mb-2">Bio (Optional)</Label>
          <Textarea
            size="sm"
            variant="outline"
            color="slate"
            placeholder="Tell us about yourself..."
            rows={3}
            value={formData.bio}
            onChange={(e: InputChangeEvent) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Register
        </button>
      </form>
    )
  },
}

export const ContactForm: Story = {
  render: () => {
    const [contactData, setContactData] = React.useState({
      name: '',
      email: '',
      subject: '',
      priority: '',
      message: '',
    })

    const [submitted, setSubmitted] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitted(true)
      console.log('Contact form submitted:', contactData)
    }

    if (submitted) {
      return (
        <div className="max-w-lg mx-auto p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-4">📧 Message Sent!</h3>
          <p className="text-blue-700">Thank you for contacting us. We'll get back to you soon!</p>
          <button
            onClick={() => {
              setSubmitted(false)
              setContactData({
                name: '',
                email: '',
                subject: '',
                priority: '',
                message: '',
              })
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <h3 className="text-lg font-medium mb-6">Contact Us</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2">Your Name</Label>
            <TextField
              size="sm"
              variant="outline"
              color="slate"
              leftIcon={<User />}
              placeholder="Enter your name"
              value={contactData.name}
              onChange={(e: InputChangeEvent) => setContactData({ ...contactData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label className="block mb-2">Email</Label>
            <TextField
              size="sm"
              variant="outline"
              color="info"
              leftIcon={<Mail />}
              type="email"
              placeholder="your@email.com"
              value={contactData.email}
              onChange={(e: InputChangeEvent) => setContactData({ ...contactData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label className="block mb-2">Subject</Label>
          <TextField
            size="sm"
            variant="outline"
            color="slate"
            placeholder="What is this about?"
            value={contactData.subject}
            onChange={(e: InputChangeEvent) => setContactData({ ...contactData, subject: e.target.value })}
            required
          />
        </div>

        <div>
          <Label className="block mb-2">Priority</Label>
          <Select
            size="sm"
            variant="outline"
            color="warning"
            placeholder="Select priority level"
            value={contactData.priority}
            onValueChange={(value: string) => setContactData({ ...contactData, priority: value })}
          >
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </Select>
        </div>

        <div>
          <Label className="block mb-2">Message</Label>
          <Textarea
            size="sm"
            variant="outline"
            color="slate"
            placeholder="Describe your inquiry or feedback..."
            rows={5}
            value={contactData.message}
            onChange={(e: InputChangeEvent) => setContactData({ ...contactData, message: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Send Message
        </button>
      </form>
    )
  },
}
