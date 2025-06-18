"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Sparkles, CheckCircle } from "lucide-react"

interface CelebrationAnimationProps {
  isVisible: boolean
  onComplete: () => void
  goalTitle: string
}

export function CelebrationAnimation({ isVisible, onComplete, goalTitle }: CelebrationAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ["#3B82F6", "#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#EC4899"][i % 6],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
  }))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Confetti */}
          {showConfetti &&
            confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: piece.color,
                  left: `${piece.x}%`,
                  top: "10%",
                }}
                initial={{
                  y: -100,
                  rotation: 0,
                  scale: 0,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotation: piece.rotation,
                  scale: [0, 1, 1, 0],
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeOut",
                }}
              />
            ))}

          {/* Main celebration content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full"
          >
            {/* Trophy animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Sparkles around trophy */}
            <div className="relative mb-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Text content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎉 Congratulations!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You completed:</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-6">"{goalTitle}"</p>

              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">100% Complete!</span>
              </div>
            </motion.div>

            {/* Stars animation */}
            <div className="absolute -top-4 -right-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </motion.div>
            </div>
            <div className="absolute -bottom-4 -left-4">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="w-6 h-6 text-pink-400 fill-current" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
