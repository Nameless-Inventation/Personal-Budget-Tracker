import { login, signup } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  return (
    <div className="flex-1 flex justify-center items-center h-screen bg-zinc-950 relative w-full overflow-hidden">
      {/* Aesthetic glowing orbs for glassmorphic backdrop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <Card className="w-[420px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-1000 z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
        <form className="relative z-10">
          <CardHeader className="space-y-1 text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome</CardTitle>
            <CardDescription className="text-zinc-400">Enter your credentials to access the tracker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required 
                className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all" />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input id="password" name="password" type="password" required 
                className="bg-black/20 border-white/10 text-white focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all" />
            </div>
            {params?.message && (
              <div className="text-sm text-red-200 text-center mt-4 bg-red-950/50 border border-red-500/30 p-3 rounded-lg backdrop-blur-md">
                {params.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all">
              Sign In
            </Button>
            <Button formAction={signup} variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
