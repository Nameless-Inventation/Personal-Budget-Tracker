import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      user = { email: 'dummy.user@example.com', user_metadata: { full_name: 'Dummy User' } };
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both relative z-10 h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your profile and account preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Profile Information</CardTitle>
            <CardDescription className="text-muted-foreground">Update your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" value={user?.email || ''} readOnly className="bg-background/50 border-border/50 text-muted-foreground opacity-70" />
              <p className="text-xs text-muted-foreground">Your email cannot be changed at this time.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">Display Name</Label>
              <Input id="name" placeholder="John Doe" className="bg-background/50 border-border/50 text-foreground" defaultValue={user?.user_metadata?.full_name || ''} />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all">Save Profile</Button>
          </CardFooter>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-red-500/20 shadow-xl border">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription className="text-muted-foreground">Irreversible account actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">
              Once you delete your account, there is no going back. All your transactions and budgets will be permanently wiped from the database.
            </p>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-4">
            <Button variant="destructive" className="bg-red-600/90 hover:bg-red-500">Delete Account</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
