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
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            artikelen: {
                Row: {
                    anchors: Json | null
                    content: Json | null
                    created_at: string
                    description: string | null
                    id: string
                    read_time: string | null
                    title: string | null
                    topics: Json | null
                    updated_at: string | null
                    words: number | null
                    published: boolean | null
                }
                Insert: {
                    anchors?: Json | null
                    content?: Json | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    read_time?: string | null
                    title?: string | null
                    topics?: Json | null
                    updated_at?: string | null
                    words?: number | null
                    published?: boolean | null
                }
                Update: {
                    anchors?: Json | null
                    content?: Json | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    read_time?: string | null
                    title?: string | null
                    topics?: Json | null
                    updated_at?: string | null
                    words?: number | null
                    published?: boolean | null
                }
                Relationships: []
            }
            attachments: {
                Row: {
                    article_id: string | null
                    id: string
                    label: string | null
                    name: string
                    published: boolean | null
                    updated_at: string
                }
                Insert: {
                    article_id?: string | null
                    id?: string
                    label?: string | null
                    name: string
                    published?: boolean | null
                    updated_at?: string
                }
                Update: {
                    article_id?: string | null
                    id?: string
                    label?: string | null
                    name?: string
                    published?: boolean | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "attachments_article_id_fkey"
                        columns: ["article_id"]
                        isOneToOne: false
                        referencedRelation: "artikelen"
                        referencedColumns: ["id"]
                    },
                ]
            }
            github_connections: {
                Row: {
                    created_at: string
                    expires_at: string | null
                    id: number
                    installation_id: string
                    token: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    expires_at?: string | null
                    id?: number
                    installation_id?: string | null
                    token?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    expires_at?: string | null
                    id?: number
                    installation_id?: string | null
                    token?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }


            subscriptions: {
                Row: {
                    id: string
                    subscription: Json | null
                    user_id: string
                }
                Insert: {
                    id?: string
                    subscription?: Json | null
                    user_id: string
                }
                Update: {
                    id?: string
                    subscription?: Json | null
                    user_id?: string
                }
                Relationships: []
            },








            navigator_sessions: {
                Row: {
                    city: string | null
                    continent_code: string | null
                    country_code: string | null
                    id: string
                    ip: string | null
                    region_code: string | null
                    screen: string | null
                    timezone: string | null
                }
                Insert: {
                    city?: string | null
                    continent_code?: string | null
                    country_code?: string | null
                    id: string
                    ip?: string | null
                    region_code?: string | null
                    screen?: string | null
                    timezone?: string | null
                }
                Update: {
                    city?: string | null
                    continent_code?: string | null
                    country_code?: string | null
                    id?: string
                    ip?: string | null
                    region_code?: string | null
                    screen?: string | null
                    timezone?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            delete_sessions_by_id: {
                Args: { p_session_id: string }
                Returns: undefined
            }

            search_artikelen: {
                Args: { search: string }
                Returns: {
                    anchors: Json | null
                    content: Json | null
                    created_at: string
                    description: string | null
                    id: string
                    read_time: string | null
                    title: string | null
                    topics: Json | null
                    updated_at: string | null
                    words: number | null
                    published: boolean | null
                }[]
            },

            get_sessions_by_user: {
                Args: { p_user_uuid: string }
                Returns: {
                    aal: string
                    auth_ip: string
                    city: string
                    continent_code: string
                    country_code: string
                    created_at: string
                    factor_id: string
                    id: string
                    navigator_ip: string
                    not_after: string
                    oauth_client_id: string
                    refresh_token_counter: number
                    refresh_token_hmac_key: string
                    refreshed_at: string
                    region_code: string
                    scopes: string
                    screen: string
                    tag: string
                    timezone: string
                    updated_at: string
                    user_agent: string
                    user_id: string
                }[]
            }
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
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const
