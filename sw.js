// COND.OS — Service Worker (notificações push)
// Fica a correr em segundo plano e mostra as notificações mesmo
// com o browser fechado.

self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event) {
  var dados = { titulo: 'COND.OS', corpo: 'Tem uma novidade no portal.', url: '/' };
  try {
    if (event.data) dados = Object.assign(dados, event.data.json());
  } catch(e) {
    if (event.data) dados.corpo = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(dados.titulo, {
      body: dados.corpo,
      icon: dados.icon || 'icon-192.png',
      badge: dados.badge || 'icon-192.png',
      tag: dados.tag || 'condos-msg',
      renotify: true,
      vibrate: [180, 80, 180],
      data: { url: dados.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var destino = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(lista) {
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].url.indexOf('portal.html') > -1 && 'focus' in lista[i]) {
          lista[i].navigate(destino);
          return lista[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(destino);
    })
  );
});
