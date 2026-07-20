'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Landmark, AlertCircle, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/validation/auth'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    setError(null)
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setError("Supabase email rate limit exceeded. Please wait a few minutes, or turn off 'Confirm Email' in your Supabase Dashboard -> Authentication -> Providers -> Email settings.")
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else if (authData?.session) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
            <CardDescription>Join PakAssist AI to save bookmarks and checklist history</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-xs text-destructive mb-4 border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="rounded-lg bg-emerald-500/15 p-4 text-sm text-emerald-700 border border-emerald-500/20 text-center font-medium">
                Registration successful! Redirecting to login...
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Muhammad Ali"
                    {...register('fullName')}
                    className={errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.fullName && <p className="text-[11px] text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            )}


          </CardContent>
          <CardFooter className="justify-center border-t border-border/60 pt-4 text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary hover:underline ml-1">Login</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
