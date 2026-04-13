import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Shield, User, UserCheck, Briefcase } from 'lucide-react';
import bizMapLogo from '@/assets/bizmap-logo.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'business'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, signInAsGuest } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!', description: 'You have signed in successfully.' });
      navigate('/');
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await signUp(email, password, displayName, accountType);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
    }
    setIsSubmitting(false);
  };

  const handleGuestAccess = async () => {
    setIsSubmitting(true);
    const { error } = await signInAsGuest();
    if (error) {
      toast({ title: 'Guest access failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome, Guest!', description: 'You have limited access. Sign up for full features.' });
      navigate('/');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/88 backdrop-blur-sm" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={bizMapLogo} alt="BizMap" className="h-12 w-12 rounded-xl" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to BizMap
          </CardTitle>
          <CardDescription>Your smart business mapping assistant</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>

                {/* Account Type Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Account Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('user')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        accountType === 'user'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <User className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs font-medium">Personal</p>
                      <p className="text-[9px] text-muted-foreground">Browse & shop</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('business')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        accountType === 'business'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Briefcase className="h-5 w-5 mx-auto mb-1 text-accent" />
                      <p className="text-xs font-medium">Business</p>
                      <p className="text-[9px] text-muted-foreground">List & manage</p>
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
                  Create {accountType === 'business' ? 'Business' : 'Personal'} Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGuestAccess} disabled={isSubmitting}>
            <MapPin className="h-4 w-4 mr-2" />
            Continue as Guest
          </Button>

          <div className="mt-6 grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <Shield className="h-4 w-4 mx-auto mb-1 text-destructive" />
              <p className="text-[10px] font-medium text-muted-foreground">Admin</p>
              <p className="text-[8px] text-muted-foreground/70">Full control</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <Briefcase className="h-4 w-4 mx-auto mb-1 text-accent" />
              <p className="text-[10px] font-medium text-muted-foreground">Business</p>
              <p className="text-[8px] text-muted-foreground/70">List & manage</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <User className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] font-medium text-muted-foreground">User</p>
              <p className="text-[8px] text-muted-foreground/70">All features</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4 mx-auto mb-1 text-earth-green" />
              <p className="text-[10px] font-medium text-muted-foreground">Guest</p>
              <p className="text-[8px] text-muted-foreground/70">View only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
