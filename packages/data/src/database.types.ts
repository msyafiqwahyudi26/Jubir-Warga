export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          criteria: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          criteria?: string | null
          description?: string | null
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          criteria?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          active: boolean | null
          city: string | null
          created_at: string | null
          id: string
          members_count: number | null
          name: string
          province: string | null
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          created_at?: string | null
          id: string
          members_count?: number | null
          name: string
          province?: string | null
        }
        Update: {
          active?: boolean | null
          city?: string | null
          created_at?: string | null
          id?: string
          members_count?: number | null
          name?: string
          province?: string | null
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          attempts: number | null
          game: string | null
          id: string
          is_demo: boolean
          played_at: string | null
          score: number | null
          user_id: string | null
          won: boolean | null
        }
        Insert: {
          attempts?: number | null
          game?: string | null
          id?: string
          is_demo?: boolean
          played_at?: string | null
          score?: number | null
          user_id?: string | null
          won?: boolean | null
        }
        Update: {
          attempts?: number | null
          game?: string | null
          id?: string
          is_demo?: boolean
          played_at?: string | null
          score?: number | null
          user_id?: string | null
          won?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      janji: {
        Row: {
          created_at: string | null
          deadline: string | null
          evidence_count: number | null
          id: string
          is_demo: boolean
          janji_text: string
          pejabat_id: string | null
          pemantau_count: number | null
          source_quote: string | null
          source_url: string | null
          status: string | null
          submitted_by: string | null
          topik: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          evidence_count?: number | null
          id?: string
          is_demo?: boolean
          janji_text: string
          pejabat_id?: string | null
          pemantau_count?: number | null
          source_quote?: string | null
          source_url?: string | null
          status?: string | null
          submitted_by?: string | null
          topik?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          evidence_count?: number | null
          id?: string
          is_demo?: boolean
          janji_text?: string
          pejabat_id?: string | null
          pemantau_count?: number | null
          source_quote?: string | null
          source_url?: string | null
          status?: string | null
          submitted_by?: string | null
          topik?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "janji_pejabat_id_fkey"
            columns: ["pejabat_id"]
            isOneToOne: false
            referencedRelation: "pejabat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      janji_evidence: {
        Row: {
          id: string
          is_demo: boolean
          janji_id: string | null
          source: string | null
          title: string | null
          type: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          id?: string
          is_demo?: boolean
          janji_id?: string | null
          source?: string | null
          title?: string | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          is_demo?: boolean
          janji_id?: string | null
          source?: string | null
          title?: string | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "janji_evidence_janji_id_fkey"
            columns: ["janji_id"]
            isOneToOne: false
            referencedRelation: "janji"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_evidence_janji_id_fkey"
            columns: ["janji_id"]
            isOneToOne: false
            referencedRelation: "janji_with_pejabat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_evidence_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      janji_pemantau: {
        Row: {
          followed_at: string | null
          janji_id: string
          user_id: string
        }
        Insert: {
          followed_at?: string | null
          janji_id: string
          user_id: string
        }
        Update: {
          followed_at?: string | null
          janji_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "janji_pemantau_janji_id_fkey"
            columns: ["janji_id"]
            isOneToOne: false
            referencedRelation: "janji"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_pemantau_janji_id_fkey"
            columns: ["janji_id"]
            isOneToOne: false
            referencedRelation: "janji_with_pejabat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_pemantau_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kampanye: {
        Row: {
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon: string | null
          id: string
          is_demo: boolean
          participant_count: number | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_demo?: boolean
          participant_count?: number | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_demo?: boolean
          participant_count?: number | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      karya: {
        Row: {
          author_id: string | null
          body: string | null
          cover_url: string | null
          featured: boolean | null
          id: string
          is_demo: boolean
          meta: string | null
          published_at: string | null
          tags: string[] | null
          title: string
          type: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          featured?: boolean | null
          id?: string
          is_demo?: boolean
          meta?: string | null
          published_at?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          featured?: boolean | null
          id?: string
          is_demo?: boolean
          meta?: string | null
          published_at?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "karya_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          featured: boolean | null
          id: string
          is_demo: boolean
          level: string | null
          mentor_id: string | null
          participant_count: number | null
          price_idr: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          is_demo?: boolean
          level?: string | null
          mentor_id?: string | null
          participant_count?: number | null
          price_idr?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          is_demo?: boolean
          level?: string | null
          mentor_id?: string | null
          participant_count?: number | null
          price_idr?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "kelas_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas_enrollment: {
        Row: {
          completed_at: string | null
          enrolled_at: string | null
          kelas_id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          enrolled_at?: string | null
          kelas_id: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          enrolled_at?: string | null
          kelas_id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kelas_enrollment_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kelas_enrollment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas_modul: {
        Row: {
          duration: string | null
          id: string
          kelas_id: string | null
          ord: number
          title: string
          transcript: string | null
          type: string | null
          video_url: string | null
        }
        Insert: {
          duration?: string | null
          id?: string
          kelas_id?: string | null
          ord: number
          title: string
          transcript?: string | null
          type?: string | null
          video_url?: string | null
        }
        Update: {
          duration?: string | null
          id?: string
          kelas_id?: string | null
          ord?: number
          title?: string
          transcript?: string | null
          type?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kelas_modul_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          dukungan_count: number | null
          id: string
          is_anonim: boolean | null
          is_demo: boolean
          location: string | null
          photo_url: string | null
          reporter_id: string | null
          resolved_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          dukungan_count?: number | null
          id?: string
          is_anonim?: boolean | null
          is_demo?: boolean
          location?: string | null
          photo_url?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          dukungan_count?: number | null
          id?: string
          is_anonim?: boolean | null
          is_demo?: boolean
          location?: string | null
          photo_url?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "laporan_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan_dukungan: {
        Row: {
          created_at: string | null
          laporan_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          laporan_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          laporan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "laporan_dukungan_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_dukungan_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan_komentar: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          id: string
          laporan_id: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          id?: string
          laporan_id?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          id?: string
          laporan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laporan_komentar_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_komentar_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
        ]
      }
      pejabat: {
        Row: {
          created_at: string | null
          dapil: string | null
          id: string
          is_demo: boolean
          jabatan: string | null
          level: string | null
          nama: string
          partai: string | null
          photo_url: string | null
          skor: number | null
        }
        Insert: {
          created_at?: string | null
          dapil?: string | null
          id?: string
          is_demo?: boolean
          jabatan?: string | null
          level?: string | null
          nama: string
          partai?: string | null
          photo_url?: string | null
          skor?: number | null
        }
        Update: {
          created_at?: string | null
          dapil?: string | null
          id?: string
          is_demo?: boolean
          jabatan?: string | null
          level?: string | null
          nama?: string
          partai?: string | null
          photo_url?: string | null
          skor?: number | null
        }
        Relationships: []
      }
      petisi: {
        Row: {
          body: string | null
          created_at: string | null
          current_count: number | null
          deadline: string | null
          icon: string | null
          id: string
          initiator_id: string | null
          is_demo: boolean
          status: string | null
          summary: string | null
          tags: string[] | null
          target: number | null
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          current_count?: number | null
          deadline?: string | null
          icon?: string | null
          id?: string
          initiator_id?: string | null
          is_demo?: boolean
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          target?: number | null
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          current_count?: number | null
          deadline?: string | null
          icon?: string | null
          id?: string
          initiator_id?: string | null
          is_demo?: boolean
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          target?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "petisi_initiator_id_fkey"
            columns: ["initiator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      petisi_signatures: {
        Row: {
          petisi_id: string
          signed_at: string | null
          user_id: string
        }
        Insert: {
          petisi_id: string
          signed_at?: string | null
          user_id: string
        }
        Update: {
          petisi_id?: string
          signed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "petisi_signatures_petisi_id_fkey"
            columns: ["petisi_id"]
            isOneToOne: false
            referencedRelation: "petisi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "petisi_signatures_petisi_id_fkey"
            columns: ["petisi_id"]
            isOneToOne: false
            referencedRelation: "petisi_with_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "petisi_signatures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polling: {
        Row: {
          created_at: string | null
          deadline: string | null
          id: string
          is_demo: boolean
          options: Json
          question: string
          status: string | null
          total_votes: number | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_demo?: boolean
          options: Json
          question: string
          status?: string | null
          total_votes?: number | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_demo?: boolean
          options?: Json
          question?: string
          status?: string | null
          total_votes?: number | null
        }
        Relationships: []
      }
      polling_votes: {
        Row: {
          option_id: string
          polling_id: string
          user_id: string
          voted_at: string | null
        }
        Insert: {
          option_id: string
          polling_id: string
          user_id: string
          voted_at?: string | null
        }
        Update: {
          option_id?: string
          polling_id?: string
          user_id?: string
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polling_votes_polling_id_fkey"
            columns: ["polling_id"]
            isOneToOne: false
            referencedRelation: "polling"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polling_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          chapter_id: string | null
          created_at: string | null
          id: string
          is_admin: boolean | null
          is_anonim: boolean | null
          is_demo: boolean
          level: number | null
          name: string | null
          onboarded: boolean | null
          updated_at: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id: string
          is_admin?: boolean | null
          is_anonim?: boolean | null
          is_demo?: boolean
          level?: number | null
          name?: string | null
          onboarded?: boolean | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          is_anonim?: boolean | null
          is_demo?: boolean
          level?: number | null
          name?: string | null
          onboarded?: boolean | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_replies: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          id: string
          is_demo: boolean
          parent_id: string | null
          thread_id: string | null
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          id?: string
          is_demo?: boolean
          parent_id?: string | null
          thread_id?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          id?: string
          is_demo?: boolean
          parent_id?: string | null
          thread_id?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads_with_author"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_votes: {
        Row: {
          created_at: string | null
          thread_id: string
          user_id: string
          vote: number | null
        }
        Insert: {
          created_at?: string | null
          thread_id: string
          user_id: string
          vote?: number | null
        }
        Update: {
          created_at?: string | null
          thread_id?: string
          user_id?: string
          vote?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads_with_author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          author_id: string | null
          body: string | null
          chapter_id: string | null
          created_at: string | null
          downvotes: number | null
          format: string | null
          hot: boolean | null
          id: string
          is_demo: boolean
          pinned: boolean | null
          preview: string | null
          reply_count: number | null
          title: string
          topic_id: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          chapter_id?: string | null
          created_at?: string | null
          downvotes?: number | null
          format?: string | null
          hot?: boolean | null
          id?: string
          is_demo?: boolean
          pinned?: boolean | null
          preview?: string | null
          reply_count?: number | null
          title: string
          topic_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          chapter_id?: string | null
          created_at?: string | null
          downvotes?: number | null
          format?: string | null
          hot?: boolean | null
          id?: string
          is_demo?: boolean
          pinned?: boolean | null
          preview?: string | null
          reply_count?: number | null
          title?: string
          topic_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      janji_with_pejabat: {
        Row: {
          created_at: string | null
          deadline: string | null
          evidence_count: number | null
          id: string | null
          janji_text: string | null
          pejabat_id: string | null
          pejabat_jabatan: string | null
          pejabat_nama: string | null
          pejabat_partai: string | null
          pejabat_skor: number | null
          pemantau_count: number | null
          source_quote: string | null
          source_url: string | null
          status: string | null
          submitted_by: string | null
          topik: string | null
          verified_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "janji_pejabat_id_fkey"
            columns: ["pejabat_id"]
            isOneToOne: false
            referencedRelation: "pejabat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "janji_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      petisi_with_progress: {
        Row: {
          body: string | null
          created_at: string | null
          current_count: number | null
          deadline: string | null
          icon: string | null
          id: string | null
          initiator_id: string | null
          initiator_name: string | null
          initiator_username: string | null
          progress_pct: number | null
          status: string | null
          summary: string | null
          tags: string[] | null
          target: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petisi_initiator_id_fkey"
            columns: ["initiator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_with_author: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_level: number | null
          author_name: string | null
          author_username: string | null
          body: string | null
          chapter_id: string | null
          chapter_name: string | null
          created_at: string | null
          downvotes: number | null
          format: string | null
          hot: boolean | null
          id: string | null
          pinned: boolean | null
          preview: string | null
          reply_count: number | null
          title: string | null
          topic_id: string | null
          topic_label: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_demo_data: {
        Args: never
        Returns: {
          deleted_count: number
          table_name: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
