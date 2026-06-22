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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      airbnb_calendario_precos: {
        Row: {
          data_calendario: string
          data_ultima_sugestao: string | null
          id: string
          id_evento_impactante: string | null
          id_propriedade_airbnb: string
          media_preco_concorrentes_pooling: number | null
          nota_justificativa_sugestao: string | null
          preco_atual_definido_usuario: number | null
          preco_sugerido_agente: number | null
          status_sugestao: string | null
        }
        Insert: {
          data_calendario: string
          data_ultima_sugestao?: string | null
          id?: string
          id_evento_impactante?: string | null
          id_propriedade_airbnb: string
          media_preco_concorrentes_pooling?: number | null
          nota_justificativa_sugestao?: string | null
          preco_atual_definido_usuario?: number | null
          preco_sugerido_agente?: number | null
          status_sugestao?: string | null
        }
        Update: {
          data_calendario?: string
          data_ultima_sugestao?: string | null
          id?: string
          id_evento_impactante?: string | null
          id_propriedade_airbnb?: string
          media_preco_concorrentes_pooling?: number | null
          nota_justificativa_sugestao?: string | null
          preco_atual_definido_usuario?: number | null
          preco_sugerido_agente?: number | null
          status_sugestao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airbnb_calendario_precos_id_evento_impactante_fkey"
            columns: ["id_evento_impactante"]
            isOneToOne: false
            referencedRelation: "airbnb_eventos_locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airbnb_calendario_precos_id_propriedade_airbnb_fkey"
            columns: ["id_propriedade_airbnb"]
            isOneToOne: false
            referencedRelation: "airbnb_propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      airbnb_concorrentes_chave: {
        Row: {
          ativo_para_pooling: boolean
          data_selecao: string
          id: string
          id_airbnb_concorrente: string
          id_propriedade_airbnb: string
          nome_anuncio_concorrente: string | null
          url_airbnb_concorrente: string | null
        }
        Insert: {
          ativo_para_pooling?: boolean
          data_selecao?: string
          id?: string
          id_airbnb_concorrente: string
          id_propriedade_airbnb: string
          nome_anuncio_concorrente?: string | null
          url_airbnb_concorrente?: string | null
        }
        Update: {
          ativo_para_pooling?: boolean
          data_selecao?: string
          id?: string
          id_airbnb_concorrente?: string
          id_propriedade_airbnb?: string
          nome_anuncio_concorrente?: string | null
          url_airbnb_concorrente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airbnb_concorrentes_chave_id_propriedade_airbnb_fkey"
            columns: ["id_propriedade_airbnb"]
            isOneToOne: false
            referencedRelation: "airbnb_propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      airbnb_eventos_locais: {
        Row: {
          data_descoberta: string
          data_fim_evento: string | null
          data_inicio_evento: string
          fonte_informacao: string | null
          id: string
          id_usuario_contribuidor: string | null
          localizacao_evento_bairro_venue: string | null
          localizacao_evento_cidade: string
          nivel_impacto_estimado: string | null
          nome_evento: string
          tipo_evento: string | null
          url_evento: string | null
        }
        Insert: {
          data_descoberta?: string
          data_fim_evento?: string | null
          data_inicio_evento: string
          fonte_informacao?: string | null
          id?: string
          id_usuario_contribuidor?: string | null
          localizacao_evento_bairro_venue?: string | null
          localizacao_evento_cidade: string
          nivel_impacto_estimado?: string | null
          nome_evento: string
          tipo_evento?: string | null
          url_evento?: string | null
        }
        Update: {
          data_descoberta?: string
          data_fim_evento?: string | null
          data_inicio_evento?: string
          fonte_informacao?: string | null
          id?: string
          id_usuario_contribuidor?: string | null
          localizacao_evento_bairro_venue?: string | null
          localizacao_evento_cidade?: string
          nivel_impacto_estimado?: string | null
          nome_evento?: string
          tipo_evento?: string | null
          url_evento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airbnb_eventos_locais_id_usuario_contribuidor_fkey"
            columns: ["id_usuario_contribuidor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      airbnb_monitoramento_concorrentes: {
        Row: {
          data_coleta: string
          data_referencia_preco: string
          id: string
          id_concorrente_airbnb_chave: string
          preco_diaria_coletado_brl: number
        }
        Insert: {
          data_coleta: string
          data_referencia_preco: string
          id?: string
          id_concorrente_airbnb_chave: string
          preco_diaria_coletado_brl: number
        }
        Update: {
          data_coleta?: string
          data_referencia_preco?: string
          id?: string
          id_concorrente_airbnb_chave?: string
          preco_diaria_coletado_brl?: number
        }
        Relationships: [
          {
            foreignKeyName: "airbnb_monitoramento_concorren_id_concorrente_airbnb_chave_fkey"
            columns: ["id_concorrente_airbnb_chave"]
            isOneToOne: false
            referencedRelation: "airbnb_concorrentes_chave"
            referencedColumns: ["id"]
          },
        ]
      }
      airbnb_propriedades: {
        Row: {
          anfitriao_e_superhost_airbnb: boolean
          avaliacao_geral_media_airbnb: number | null
          capacidade_hospedes_airbnb: number
          data_criacao_registro: string
          data_ultima_extracao_airbnb: string
          descricao_completa_airbnb: string
          detalhes_avaliacoes_airbnb: Json | null
          detalhes_avaliacoes_categorias_airbnb: Json | null
          estadia_minima_padrao_airbnb: number | null
          fotos_urls_airbnb: Json
          id: string
          id_airbnb: string
          id_usuario_proprietario: string
          impostos_incluidos_preco_airbnb: boolean | null
          latitude: number
          lista_comodidades_completa_airbnb: Json
          localizacao_bairro_area: string
          localizacao_cidade: string
          longitude: number
          moeda_preco_noite_airbnb: string | null
          nome_anfitriao_airbnb: string
          nome_propriedade_interno: string
          numero_avaliacoes_total_airbnb: number | null
          numero_banheiros_airbnb: number
          numero_quartos_airbnb: number
          politica_cancelamento_airbnb: string
          preco_base_manual_usuario: number | null
          preco_noite_base_airbnb: number | null
          regras_casa_airbnb: string
          taxa_limpeza_airbnb: number | null
          taxa_servico_hospede_airbnb: number | null
          tipo_propriedade_airbnb: string
          titulo_anuncio_airbnb: string
          url_anuncio_airbnb: string | null
        }
        Insert: {
          anfitriao_e_superhost_airbnb: boolean
          avaliacao_geral_media_airbnb?: number | null
          capacidade_hospedes_airbnb: number
          data_criacao_registro?: string
          data_ultima_extracao_airbnb: string
          descricao_completa_airbnb: string
          detalhes_avaliacoes_airbnb?: Json | null
          detalhes_avaliacoes_categorias_airbnb?: Json | null
          estadia_minima_padrao_airbnb?: number | null
          fotos_urls_airbnb: Json
          id?: string
          id_airbnb: string
          id_usuario_proprietario: string
          impostos_incluidos_preco_airbnb?: boolean | null
          latitude: number
          lista_comodidades_completa_airbnb: Json
          localizacao_bairro_area: string
          localizacao_cidade: string
          longitude: number
          moeda_preco_noite_airbnb?: string | null
          nome_anfitriao_airbnb: string
          nome_propriedade_interno: string
          numero_avaliacoes_total_airbnb?: number | null
          numero_banheiros_airbnb: number
          numero_quartos_airbnb: number
          politica_cancelamento_airbnb: string
          preco_base_manual_usuario?: number | null
          preco_noite_base_airbnb?: number | null
          regras_casa_airbnb: string
          taxa_limpeza_airbnb?: number | null
          taxa_servico_hospede_airbnb?: number | null
          tipo_propriedade_airbnb: string
          titulo_anuncio_airbnb: string
          url_anuncio_airbnb?: string | null
        }
        Update: {
          anfitriao_e_superhost_airbnb?: boolean
          avaliacao_geral_media_airbnb?: number | null
          capacidade_hospedes_airbnb?: number
          data_criacao_registro?: string
          data_ultima_extracao_airbnb?: string
          descricao_completa_airbnb?: string
          detalhes_avaliacoes_airbnb?: Json | null
          detalhes_avaliacoes_categorias_airbnb?: Json | null
          estadia_minima_padrao_airbnb?: number | null
          fotos_urls_airbnb?: Json
          id?: string
          id_airbnb?: string
          id_usuario_proprietario?: string
          impostos_incluidos_preco_airbnb?: boolean | null
          latitude?: number
          lista_comodidades_completa_airbnb?: Json
          localizacao_bairro_area?: string
          localizacao_cidade?: string
          longitude?: number
          moeda_preco_noite_airbnb?: string | null
          nome_anfitriao_airbnb?: string
          nome_propriedade_interno?: string
          numero_avaliacoes_total_airbnb?: number | null
          numero_banheiros_airbnb?: number
          numero_quartos_airbnb?: number
          politica_cancelamento_airbnb?: string
          preco_base_manual_usuario?: number | null
          preco_noite_base_airbnb?: number | null
          regras_casa_airbnb?: string
          taxa_limpeza_airbnb?: number | null
          taxa_servico_hospede_airbnb?: number | null
          tipo_propriedade_airbnb?: string
          titulo_anuncio_airbnb?: string
          url_anuncio_airbnb?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airbnb_propriedades_id_usuario_proprietario_fkey"
            columns: ["id_usuario_proprietario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_resultados_esportivos_oficiais_history: {
        Row: {
          assistant_type: string
          created_at: string
          id: string
          is_verified: boolean | null
          message: string | null
          message_content: string
          metadata: Json | null
          response_time: string | null
          sender: string
          session_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          assistant_type: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          message?: string | null
          message_content: string
          metadata?: Json | null
          response_time?: string | null
          sender: string
          session_id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          assistant_type?: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          message?: string | null
          message_content?: string
          metadata?: Json | null
          response_time?: string | null
          sender?: string
          session_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digirioh_app_whatsapp_chat_history: {
        Row: {
          id: number
          message: Json
          message_timestamp: string | null
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          message_timestamp?: string | null
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          message_timestamp?: string | null
          session_id?: string
        }
        Relationships: []
      }
      digirioh_cron_tasks: {
        Row: {
          created_at: string
          cron_logic: Json | null
          execution_count: number | null
          id: number
          is_active: boolean | null
          is_recurring: boolean | null
          last_execution_at: string | null
          next_execution_at: string | null
          task_prompt: string
          task_title: string
          updated_at: string | null
          user_id: string | null
          whatsapp_jid: string
        }
        Insert: {
          created_at?: string
          cron_logic?: Json | null
          execution_count?: number | null
          id?: number
          is_active?: boolean | null
          is_recurring?: boolean | null
          last_execution_at?: string | null
          next_execution_at?: string | null
          task_prompt?: string
          task_title?: string
          updated_at?: string | null
          user_id?: string | null
          whatsapp_jid: string
        }
        Update: {
          created_at?: string
          cron_logic?: Json | null
          execution_count?: number | null
          id?: number
          is_active?: boolean | null
          is_recurring?: boolean | null
          last_execution_at?: string | null
          next_execution_at?: string | null
          task_prompt?: string
          task_title?: string
          updated_at?: string | null
          user_id?: string | null
          whatsapp_jid?: string
        }
        Relationships: [
          {
            foreignKeyName: "digirioh_cron_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      digirioh_followup_status: {
        Row: {
          followup_timestamp: string | null
          last_update: string | null
          remote_jid: string
          status: string
          user_intent: Json | null
        }
        Insert: {
          followup_timestamp?: string | null
          last_update?: string | null
          remote_jid: string
          status: string
          user_intent?: Json | null
        }
        Update: {
          followup_timestamp?: string | null
          last_update?: string | null
          remote_jid?: string
          status?: string
          user_intent?: Json | null
        }
        Relationships: []
      }
      digirioh_incoming_message_queue: {
        Row: {
          grouped_message_id: number | null
          id: number
          message_id: string
          message_timestamp: string
          processed_text: string
          received_at: string
          status: string
          whatsapp_jid: string
        }
        Insert: {
          grouped_message_id?: number | null
          id?: number
          message_id: string
          message_timestamp: string
          processed_text: string
          received_at?: string
          status?: string
          whatsapp_jid: string
        }
        Update: {
          grouped_message_id?: number | null
          id?: number
          message_id?: string
          message_timestamp?: string
          processed_text?: string
          received_at?: string
          status?: string
          whatsapp_jid?: string
        }
        Relationships: []
      }
      digirioh_knowledge_base: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          embedding: string | null
          id: number
          keywords: string[] | null
          knowledge_type: string
          last_accessed_at: string | null
          metadata: Json | null
          relevance_score: number | null
          tsv: unknown
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: number
          keywords?: string[] | null
          knowledge_type: string
          last_accessed_at?: string | null
          metadata?: Json | null
          relevance_score?: number | null
          tsv?: unknown
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: number
          keywords?: string[] | null
          knowledge_type?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          relevance_score?: number | null
          tsv?: unknown
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          account_name: string
          account_type: string | null
          balance: number
          id: number
          last_updated: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_type?: string | null
          balance?: number
          id?: number
          last_updated?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string | null
          balance?: number
          id?: number
          last_updated?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_commitments: {
        Row: {
          amount: number
          category: string | null
          commitment_type: string
          contact_name: string | null
          created_at: string
          description: string
          due_date: string
          id: number
          is_recurring: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          commitment_type: string
          contact_name?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: number
          is_recurring?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          commitment_type?: string
          contact_name?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: number
          is_recurring?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_id: number
          amount: number
          category: string | null
          contact_name: string | null
          created_at: string
          description: string
          id: number
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: number
          amount: number
          category?: string | null
          contact_name?: string | null
          created_at?: string
          description: string
          id?: number
          transaction_date?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: number
          amount?: number
          category?: string | null
          contact_name?: string | null
          created_at?: string
          description?: string
          id?: number
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          created_at: string
          currency: string | null
          flight_details: Json
          id: number
          price: number | null
          trip_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          flight_details: Json
          id?: number
          price?: number | null
          trip_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          flight_details?: Json
          id?: number
          price?: number | null
          trip_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flights_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      google_watch_channels: {
        Row: {
          calendar_id_watched: string
          created_at: string
          expiration_timestamp: string
          google_channel_id: string
          google_resource_id: string
          id: string
          last_sync_token: string | null
          status: string
          updated_at: string
          user_id: string
          webhook_validation_token: string
        }
        Insert: {
          calendar_id_watched?: string
          created_at?: string
          expiration_timestamp: string
          google_channel_id: string
          google_resource_id: string
          id?: string
          last_sync_token?: string | null
          status?: string
          updated_at?: string
          user_id: string
          webhook_validation_token: string
        }
        Update: {
          calendar_id_watched?: string
          created_at?: string
          expiration_timestamp?: string
          google_channel_id?: string
          google_resource_id?: string
          id?: string
          last_sync_token?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          webhook_validation_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_watch_channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_list_items: {
        Row: {
          created_at: string
          deadline: string | null
          id: number
          is_purchased: boolean
          item_name: string
          market_name: string | null
          price_approx: number | null
          quantity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: number
          is_purchased?: boolean
          item_name: string
          market_name?: string | null
          price_approx?: number | null
          quantity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: number
          is_purchased?: boolean
          item_name?: string
          market_name?: string | null
          price_approx?: number | null
          quantity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pending_reminders: {
        Row: {
          created_at: string
          error_message: string | null
          event_start_time: string | null
          event_summary: string | null
          google_event_id: string
          id: number
          message_to_send: string
          reminder_timestamp: string
          sent: boolean
          sent_at: string | null
          user_id: string
          user_jid: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_start_time?: string | null
          event_summary?: string | null
          google_event_id: string
          id?: number
          message_to_send: string
          reminder_timestamp: string
          sent?: boolean
          sent_at?: string | null
          user_id: string
          user_jid: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_start_time?: string | null
          event_summary?: string | null
          google_event_id?: string
          id?: number
          message_to_send?: string
          reminder_timestamp?: string
          sent?: boolean
          sent_at?: string | null
          user_id?: string
          user_jid?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allowed_assistants: string[] | null
          avatar_url: string | null
          evolution_instance_key: string | null
          full_name: string | null
          google_access_token: string | null
          google_email: string | null
          google_id: string | null
          google_refresh_token: string | null
          google_token_expires_at: string | null
          id: string
          plan: string
          preferred_name: string | null
          push_name_whatsapp: string | null
          role: string
          updated_at: string | null
          whatsapp_jid: string | null
        }
        Insert: {
          allowed_assistants?: string[] | null
          avatar_url?: string | null
          evolution_instance_key?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_email?: string | null
          google_id?: string | null
          google_refresh_token?: string | null
          google_token_expires_at?: string | null
          id: string
          plan?: string
          preferred_name?: string | null
          push_name_whatsapp?: string | null
          role?: string
          updated_at?: string | null
          whatsapp_jid?: string | null
        }
        Update: {
          allowed_assistants?: string[] | null
          avatar_url?: string | null
          evolution_instance_key?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_email?: string | null
          google_id?: string | null
          google_refresh_token?: string | null
          google_token_expires_at?: string | null
          id?: string
          plan?: string
          preferred_name?: string | null
          push_name_whatsapp?: string | null
          role?: string
          updated_at?: string | null
          whatsapp_jid?: string | null
        }
        Relationships: []
      }
      trip_accommodations: {
        Row: {
          address: string | null
          booking_url: string | null
          created_at: string
          details_json: Json | null
          hotel_id: string | null
          hotel_name: string
          id: number
          latitude: number | null
          longitude: number | null
          photo_url: string | null
          price_currency: string | null
          price_per_stay: number | null
          review_score: number | null
          trip_id: number
          user_id: string
        }
        Insert: {
          address?: string | null
          booking_url?: string | null
          created_at?: string
          details_json?: Json | null
          hotel_id?: string | null
          hotel_name: string
          id?: number
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          price_currency?: string | null
          price_per_stay?: number | null
          review_score?: number | null
          trip_id: number
          user_id: string
        }
        Update: {
          address?: string | null
          booking_url?: string | null
          created_at?: string
          details_json?: Json | null
          hotel_id?: string | null
          hotel_name?: string
          id?: number
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          price_currency?: string | null
          price_per_stay?: number | null
          review_score?: number | null
          trip_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_accommodations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_attractions: {
        Row: {
          created_at: string
          id: number
          poi_category: string | null
          poi_lat: number
          poi_lon: number
          poi_name: string
          trip_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          poi_category?: string | null
          poi_lat: number
          poi_lon: number
          poi_name: string
          trip_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          poi_category?: string | null
          poi_lat?: number
          poi_lon?: number
          poi_name?: string
          trip_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_attractions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          end_date: string
          id: number
          interests: string | null
          optimal_centroid_lat: number | null
          optimal_centroid_lon: number | null
          start_date: string
          status: string
          trip_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          interests?: string | null
          optimal_centroid_lat?: number | null
          optimal_centroid_lon?: number | null
          start_date: string
          status?: string
          trip_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          interests?: string | null
          optimal_centroid_lat?: number | null
          optimal_centroid_lon?: number | null
          start_date?: string
          status?: string
          trip_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_calendar_events: {
        Row: {
          attendees: Json | null
          calendar_id: string
          created_google: string | null
          description: string | null
          end_time: string | null
          event_timezone: string | null
          google_event_id: string
          html_link: string | null
          id: number
          is_allday: boolean
          location: string | null
          organizer_email: string | null
          reminders_override: Json | null
          start_time: string | null
          status: string | null
          summary: string | null
          synced_at: string
          updated_google: string | null
          user_id: string
          user_jid: string | null
        }
        Insert: {
          attendees?: Json | null
          calendar_id: string
          created_google?: string | null
          description?: string | null
          end_time?: string | null
          event_timezone?: string | null
          google_event_id: string
          html_link?: string | null
          id?: number
          is_allday?: boolean
          location?: string | null
          organizer_email?: string | null
          reminders_override?: Json | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          synced_at?: string
          updated_google?: string | null
          user_id: string
          user_jid?: string | null
        }
        Update: {
          attendees?: Json | null
          calendar_id?: string
          created_google?: string | null
          description?: string | null
          end_time?: string | null
          event_timezone?: string | null
          google_event_id?: string
          html_link?: string | null
          id?: number
          is_allday?: boolean
          location?: string | null
          organizer_email?: string | null
          reminders_override?: Json | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          synced_at?: string
          updated_google?: string | null
          user_id?: string
          user_jid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_last_location: {
        Row: {
          created_at: string
          latitude: number | null
          longitude: number | null
          timestamp: string | null
          user_jid: string
        }
        Insert: {
          created_at?: string
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          user_jid: string
        }
        Update: {
          created_at?: string
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          user_jid?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string
          id: number
          label: string | null
          latitude: number | null
          longitude: number | null
          user_jid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          user_jid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          user_jid?: string | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profile_notes: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          metadata: Json | null
          note_content: string
          note_key: string | null
          note_type: string
          tsv: unknown
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          note_content: string
          note_key?: string | null
          note_type: string
          tsv?: unknown
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          note_content?: string
          note_key?: string | null
          note_type?: string
          tsv?: unknown
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_linking_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          code?: string
          created_at?: string
          expires_at: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      wish_list_items: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          id: number
          is_acquired: boolean
          item_name: string
          occasion: string | null
          price_target: number | null
          priority: number | null
          store_or_link: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: number
          is_acquired?: boolean
          item_name: string
          occasion?: string | null
          price_target?: number | null
          priority?: number | null
          store_or_link?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: number
          is_acquired?: boolean
          item_name?: string
          occasion?: string | null
          price_target?: number | null
          priority?: number | null
          store_or_link?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_mark_commitment_as_paid:
        | {
            Args: { p_commitment_id: number; p_user_id: string }
            Returns: {
              account_id: number
              amount: number
              category: string | null
              contact_name: string | null
              created_at: string
              description: string
              id: number
              transaction_date: string
              transaction_type: string
              updated_at: string
              user_id: string
            }[]
            SetofOptions: {
              from: "*"
              to: "financial_transactions"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: {
              p_account_name: string
              p_commitment_id: number
              p_user_id: string
            }
            Returns: {
              account_id: number
              amount: number
              category: string | null
              contact_name: string | null
              created_at: string
              description: string
              id: number
              transaction_date: string
              transaction_type: string
              updated_at: string
              user_id: string
            }[]
            SetofOptions: {
              from: "*"
              to: "financial_transactions"
              isOneToOne: false
              isSetofReturn: true
            }
          }
      fn_record_transaction: {
        Args: {
          p_account_name: string
          p_amount: number
          p_category?: string
          p_contact_name?: string
          p_date: string
          p_description: string
          p_transaction_type: string
          p_user_id: string
        }
        Returns: {
          account_id: number
          amount: number
          category: string | null
          contact_name: string | null
          created_at: string
          description: string
          id: number
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "financial_transactions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_latest_chat_history_entry: {
        Args: { p_user_id: string }
        Returns: {
          assistant_type: string
          created_at: string
          id: string
          is_verified: boolean | null
          message: string | null
          message_content: string
          metadata: Json | null
          response_time: string | null
          sender: string
          session_id: string
          status: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "chat_resultados_esportivos_oficiais_history"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_my_role: { Args: never; Returns: string }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"]; user_id: string }
        Returns: boolean
      }
      insert_user_to_profiles: { Args: { user_id: string }; Returns: undefined }
      manage_user_assistant_plans: {
        Args: { p_assistant_types: string[]; p_user_id: string }
        Returns: boolean
      }
      user_owns_airbnb_property: {
        Args: { property_id: string }
        Returns: boolean
      }
      user_owns_concorrente_chave: {
        Args: { p_id_concorrente_airbnb_chave: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
