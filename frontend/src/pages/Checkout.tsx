import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  promoCode: z.string().optional()
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, guests } = location.state || {};
  
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  if (!experience || !slot || !guests) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid booking data</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const basePrice = experience.price * guests;
  const discount = appliedPromo
    ? appliedPromo.type === 'percentage'
      ? basePrice * (appliedPromo.value / 100)
      : appliedPromo.value
    : 0;
  const finalPrice = basePrice - discount;

  const promoCode = watch('promoCode');

  const handleApplyPromo = async () => {
    if (!promoCode) return;

    setIsValidatingPromo(true);
    try {
      const promo = await mockApi.validatePromoCode(promoCode);
      if (promo) {
        setAppliedPromo(promo);
        toast({
          title: 'Promo Code Applied',
          description: promo.description
        });
      } else {
        toast({
          title: 'Invalid Promo Code',
          description: 'The promo code you entered is not valid',
          variant: 'destructive'
        });
      }
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const result = await mockApi.createBooking({
        experienceId: experience.id,
        slotId: slot.id,
        date: slot.date,
        time: slot.time,
        guests,
        name: data.name,
        email: data.email,
        phone: data.phone,
        promoCode: appliedPromo?.code
      });

      navigate('/booking-result', {
        state: {
          result,
          experience,
          slot,
          guests,
          finalPrice
        }
      });
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Complete Your Booking
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="John Doe"
                      className="mt-2"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="+1 (555) 000-0000"
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="promoCode"
                        {...register('promoCode')}
                        placeholder="Enter code"
                        disabled={!!appliedPromo}
                      />
                      {appliedPromo ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAppliedPromo(null)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyPromo}
                          disabled={isValidatingPromo || !promoCode}
                        >
                          {isValidatingPromo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      )}
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">
                          {appliedPromo.description}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Try: SAVE10, FLAT100, or WELCOME20
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {experience.title}
                  </h3>
                  <Badge variant="secondary">{experience.category}</Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(slot.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{slot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium text-foreground">{guests}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${experience.price} × {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium text-foreground">
                      ${basePrice}
                    </span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${finalPrice.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
