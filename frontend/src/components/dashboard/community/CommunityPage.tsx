import React, { useState } from 'react';
import { Card, CardContent } from '../../ui';
import { Button } from '../../ui';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui';
import { Badge } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { 
  Star, 
  MessageSquare, 
  Heart, 
  Share2, 
  TrendingUp,
  Users,
  BookOpen,
  Plus
} from 'lucide-react';

const communityPosts = [
  {
    id: 1,
    user: {
      name: "María González",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    type: "review",
    book: {
      title: "El Nombre del Viento",
      author: "Patrick Rothfuss",
      cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    rating: 4.5,
    content: "Una obra maestra de la fantasía moderna. Rothfuss ha creado un mundo increíblemente detallado.",
    time: "hace 2 horas",
    likes: 47,
    comments: 12
  },
  {
    id: 2,
    user: {
      name: "Carlos Mendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: false
    },
    type: "milestone",
    content: "¡Acabo de completar mi meta de 20 libros este año! 🎉",
    time: "hace 4 horas",
    likes: 89,
    comments: 24
  },
  {
    id: 3,
    user: {
      name: "Ana Torres",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    type: "recommendation",
    book: {
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      cover: "https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    content: "Si te gusta la literatura contemporánea, este libro te va a enamorar.",
    time: "hace 1 día",
    likes: 34,
    comments: 8
  }
];

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"feed" | "trending" | "following">("feed");

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-neutral-900">{rating}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Comunidad</h1>
          <p className="text-neutral-500">Conecta con otros lectores y comparte tus experiencias</p>
        </div>
        
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Crear publicación
        </Button>
      </div>

      {/* Tabs */}
      <Card className="bg-white rounded-2xl shadow-sm border border-border">
        <CardContent className="p-1">
          <div className="flex gap-1">
            {[
              { id: "feed", label: "Feed", icon: BookOpen },
              { id: "trending", label: "Trending", icon: TrendingUp },
              { id: "following", label: "Siguiendo", icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 rounded-xl transition-all duration-200 ${
                    selectedTab === tab.id
                      ? "bg-neutral-100 text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {communityPosts.map((post) => (
          <Card key={post.id} className="bg-white rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 space-y-4">
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{post.user.name}</h3>
                    {post.user.verified && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{post.time}</p>
                </div>
              </div>

              {/* Book Info (if applicable) */}
              {post.book && (
                <div className="flex gap-3 p-3 bg-neutral-100 rounded-xl">
                  <ImageWithFallback
                    src={post.book.cover}
                    alt={post.book.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-neutral-900">{post.book.title}</h4>
                    <p className="text-sm text-neutral-500">{post.book.author}</p>
                    {post.rating && (
                      <div className="mt-2">
                        <StarRating rating={post.rating} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Post Content */}
              <p className="text-neutral-900 leading-relaxed">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-red-500 gap-2 p-2">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-blue-500 gap-2 p-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900 p-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg" className="border-neutral-200 text-neutral-500 hover:bg-neutral-100 rounded-xl">
          Cargar más publicaciones
        </Button>
      </div>
    </div>
  );
};

export default CommunityPage;