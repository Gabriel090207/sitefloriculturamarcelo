import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

_firestore = None


def get_firestore():
    global _firestore

    if _firestore:
        return _firestore

    service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if not service_account:
        raise Exception("FIREBASE_SERVICE_ACCOUNT não configurado")

    cred = credentials.Certificate(json.loads(service_account))

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    _firestore = firestore.client()
    return _firestore
