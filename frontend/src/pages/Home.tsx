import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '@/services/mockApi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, Star, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from "react-router-dom";



const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: mockApi.getExperiences
  });

  const filteredExperiences = experiences?.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
  <img
    src="/image.png"
    alt="Highway Delite"
    className="h-14 w-auto"
  />

  
</div>
<nav className="hidden md:flex gap-6">
  
  
  <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
    About
  </Link>
</nav>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Discover Amazing Experiences
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Book unique adventures, tours, and activities with trusted local guides
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search experiences, locations, or categories..."
                className="pl-12 h-14 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Popular Experiences
            </h3>
            <p className="text-muted-foreground">
              {filteredExperiences?.length || 0} experiences available
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences?.map((experience) => (
                <Card 
                  key={experience.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/experience/${experience.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {experience.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                      {experience.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {experience.shortDescription}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{experience.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium text-foreground">{experience.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({experience.reviewCount} reviews)
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        ${experience.price}
                      </span>
                      <span className="text-sm text-muted-foreground"> / person</span>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>created by Priyanshu Pandey as a part of Highway Delite project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
