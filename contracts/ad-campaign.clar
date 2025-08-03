(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-CAMPAIGN-NOT-FOUND u101)
(define-constant ERR-ALREADY-ENDED u102)
(define-data-var admin principal tx-sender)

(define-map campaigns
  ((id uint))
  {
    title: (string-utf8 64),
    target-url: (string-utf8 128),
    owner: principal,
    status: (string-utf8 1)
  }
)

(define-private (generate-campaign-id)
  (block-height)
)

(define-private (only-owner (campaign-id uint))
  (let (
        (campaign-result (map-get campaigns { id: campaign-id }))
  )
    (match campaign-result
      (some campaign)
        (if (is-eq (get owner campaign) tx-sender)
          true
          (err ERR-NOT-AUTHORIZED)
        )
      (none) (err ERR-CAMPAIGN-NOT-FOUND)
    )
  )
)

(define-private (get-campaign (id uint))
  (match (map-get campaigns { id: id })
    (some campaign) campaign
    (none) (err ERR-CAMPAIGN-NOT-FOUND)
  )
)

(define-public (create-campaign (title (string-utf8 64)) (target-url (string-utf8 128)))
  (begin
    (let (
          (id (generate-campaign-id))
    )
      (map-set campaigns { id: id } {
        title: title,
        target-url: target-url,
        owner: tx-sender,
        status: (utf8 "a") ;; 'a' = active
      })
      (ok id)
    )
  )
)

(define-public (pause-campaign (campaign-id uint))
  (begin
    (only-owner campaign-id)
    (let ((campaign (unwrap! (get-campaign campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
      (map-set campaigns { id: campaign-id } (merge campaign { status: (utf8 "p") })) ;; 'p' = paused
      (ok true)
    )
  )
)

(define-public (resume-campaign (campaign-id uint))
  (begin
    (only-owner campaign-id)
    (let ((campaign (unwrap! (get-campaign campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
      (asserts! (not (is-eq (get status campaign) (utf8 "e"))) (err ERR-ALREADY-ENDED))
      (map-set campaigns { id: campaign-id } (merge campaign { status: (utf8 "a") }))
      (ok true)
    )
  )
)

(define-public (end-campaign (campaign-id uint))
  (begin
    (only-owner campaign-id)
    (let ((campaign (unwrap! (get-campaign campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
      (map-set campaigns { id: campaign-id } (merge campaign { status: (utf8 "e") })) ;; 'e' = ended
      (ok true)
    )
  )
)

(define-read-only (get-campaign-by-id (id uint))
  (map-get campaigns { id: id })
)

(define-read-only (get-admin)
  (ok (var-get admin))
)

(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
