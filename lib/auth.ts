import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error("Signup error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Signup failed:", error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Signin error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Signin failed:", error)
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error("Signout failed:", error)
    throw error
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check if we have a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return null
    }

    if (!session) {
      return null
    }

    // If we have a session, get the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Get user error:", userError)
      return null
    }

    return user
  } catch (error) {
    console.error("Get current user failed:", error)
    return null
  }
}

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Get profile failed:", error)
    throw error
  }
}

export const updateProfile = async (
  userId: string,
  updates: {
    full_name?: string
    bio?: string
    avatar_url?: string
  },
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Update profile failed:", error)
    throw error
  }
}

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, {
      upsert: true,
    })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Upload avatar failed:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
}
