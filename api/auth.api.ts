import { supabase } from "@/lib/supabase";

// Sign up
export async function signUp(
    email:string,
    password:string,
    firstName:string,
    lastName:string
){
    const {data,error} =
    await supabase.auth.signUp({
        email,
        password,
        options:{
            data:{
                first_name:firstName,
                last_name:lastName
            }
        }
    });

    if(error)
        throw error;
    return data;

}

// Sign in
export async function signIn(
    email:string,
    password:string
){
    const {data,error} =
    await supabase.auth
    .signInWithPassword({
        email,
        password

    });
    if(error)
        throw error;
    return data;

}

// Sign out

export async function signOut(){
    const {error} =
    await supabase.auth.signOut();
    if(error)
        throw error;

}


// Get current session

export async function getSession(){
    const {data,error} =
    await supabase.auth.getSession();
    if(error)
        throw error;
    return data.session;

}

// Get current user

export async function getCurrentUser(){
    const {data,error} =
    await supabase.auth.getUser();
    if(error)
        throw error;
    return data.user;

}