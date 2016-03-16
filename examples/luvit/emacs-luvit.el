
; (defun eval-string (string)
;   "Evaluate a string of elisp code for side effects."
;   (with-temp-buffer
;     (insert string)
;     (eval-buffer)))

(defun eval-string (string)
  "Evaluate elisp code stored in a string."
  (eval (car (read-from-string string))))

(require 'package)
(require 'websocket)

(defcustom ws--port 31820
  "websocket server port."
  :group 'ws
  :type 'integer)

(defun reply (x)
  (websocket-send-text ws--client (format "%S" x)))

(defun eval-and-reply (string)
  (reply (eval-string string)))

(defun handle-data (string)
  ;(message "ws frame: %S" string)
  (condition-case err
    (reply (eval-string string))
    (reply err)))

(setq ws--client
  (websocket-open (format "ws://localhost:%d" ws--port)
   :on-error (lambda (ws type err) (message "error connecting"))
   :on-message (lambda (websocket frame) (handle-data (websocket-frame-payload frame)))
   :on-close (lambda (websocket) (setq ws--client nil))))







