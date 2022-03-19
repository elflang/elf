(def iter (l (o k))
  (let (ks () lo nil hi nil)
    (each (k v) l
      (if (num? k)
          (do (%lua (-- k))
              (if (nil? lo) (= lo k))
              (if (nil? hi) (= hi k))
              (if (< k lo) (= lo k))
              (if (> k hi) (= hi k)))
        (add ks k)))
    (unless (nil? hi) (++ hi))
    (fn ()
      (if (some? ks)
          (let (k (drop ks)
                v (get l k))
            (return (list k v)))
          (if (and (~nil? lo) (< lo hi))
              (let (i lo
                    v (at l i))
                (++ lo)
                (return (list i v))))))))

(def nextk (l (o k))
  (each (k1 v) l
    (print (str (list k1 v l)))
    (if (nil? k) (return k1))
    (if (is k k1) (= k nil))))
  

                
                
              



(def car (a)
  (if (nil? a) a
    (hd a)))

;(def cdr (a)
;  (if (nil? a) a
;      (

;(def y-put (l k rest: args)
;  (let (v (hd args)
;        wipe? (none? args))
;    (if (list? l)

