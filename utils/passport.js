    import passport from 'passport'
    import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

    import User from '../models/User.js'
    import 'dotenv/config'

    passport.use(new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://meetus-saidov.onrender.com/api/auth/google/callback',
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {
                let user=await User.findOne({email:profile.emails[0].value})
       

                if(!user){
                    user=await User.create({
                        fullname:profile.displayName,
                        email:profile.emails[0].value
                    })
                }
                console.log(user,profile.emails[0].value,profile.displayName);
                return done(null,user)

            } catch (error) {
                done(error,null)
            }
        }

    ))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        const user=await User.findById(id)
        done(null,user)
    })
