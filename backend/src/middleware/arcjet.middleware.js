import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        
        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
            } 
            else if(decision.reason.isBot()){
                return res.status(403).json({ error: "Access denied. Bot traffic is not allowed." });
            }else{
                return res.status(403).json({ error: "Access denied by security policy." });
            }
        }

        // check for spoofed bots
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ 
                error: "Spoofed bot detected.",
                message: "Malicious bot activity detected"
            });
        }

        next();
        
    } catch (error) {
        console.log("Arcjet protection error:", error);
        next();
    }
}