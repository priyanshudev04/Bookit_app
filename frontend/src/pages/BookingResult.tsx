import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Home, Mail } from 'lucide-react';
import { format } from 'date-fns';

const BookingResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, experience, slot, guests, finalPrice } = location.state || {};

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No booking information found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }
  
const isSuccess =
  result?.success === true ||
  result?.message?.toLowerCase().includes('success');


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Status Icon */}
          <div className="text-center mb-8">
            {isSuccess ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-lg text-muted-foreground">
                  {result.message}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
                  <XCircle className="w-12 h-12 text-destructive" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Booking Failed
                </h1>
                <p className="text-lg text-muted-foreground">
                  {result.message}
                </p>
              </>
            )}
          </div>

          {/* Booking Details */}
          {isSuccess && result.bookingId && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    {result.bookingId}
                  </p>
                </div>

                {experience && (
                  <>
                    <Separator />
                    
                    <div>
                      <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <img
                          src={experience.image}
                          alt={experience.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {experience.location}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Date</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(slot.date), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Time</p>
                        <p className="font-medium text-foreground">{slot.time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Guests</p>
                        <p className="font-medium text-foreground">{guests}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Total Paid</p>
                        <p className="font-medium text-foreground">
                          ${finalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {result.details && (
                      <>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Guest Name</p>
                            <p className="font-medium text-foreground">
                              {result.details.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Email</p>
                            <p className="font-medium text-foreground">
                              {result.details.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium text-foreground">
                              {result.details.phone}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirmation Message */}
          {isSuccess && (
            <Card className="bg-primary/5 border-primary/20 mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Confirmation Email Sent
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with all the details to your email
                      address. Please check your inbox.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            {!isSuccess && (
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingResult;
