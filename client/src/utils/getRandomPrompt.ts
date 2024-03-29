const surpriseMePrompts = [
  'an oil painting of a tranquil pastoral scene in the style of the Dutch masters',
  'a charcoal sketch of a philosopher in deep contemplation, reminiscent of Michelangelo',
  'a watercolor painting of a bustling Parisian street scene in the late 19th century',
  'an etching of an ancient battle, in the style of a Greek vase painting',
  'a pencil drawing of a courtly Renaissance feast',
  'a copperplate engraving of an intricate botanical study',
  'an oil painting of a serene landscape at dawn, inspired by Claude Lorrain',
  'a portrait of a noble lady, reminiscent of the style of Johannes Vermeer',
  'a black and white etching of a bustling market scene, in the style of Rembrandt',
  'a grand historical painting depicting the signing of a major treaty',
  'an intricate woodcut print of a map of a 16th century city',
  'a portrait of a man in contemplation, in the style of Leonardo da Vinci',
  'a delicate watercolor of a woman reading a letter, inspired by Mary Cassatt',
  'an allegorical oil painting depicting the four seasons',
  'a pen and ink drawing of a Gothic cathedral',
  'a chiaroscuro oil painting of a dramatic biblical scene',
  'a pastel portrait of a young woman, in the style of Edgar Degas',
  'an oil painting of a nocturnal scene illuminated by candlelight, reminiscent of Joseph Wright of Derby',
  'a bronze sculpture of a mythological creature',
  'a large-scale history painting depicting a key event from classical mythology',
  'a neoclassical sculpture of a renowned philosopher',
  'a marble bust of a powerful Roman emperor',
  'a Renaissance-style fresco of a heavenly scene',
  'an impressionist painting of a bustling café scene in 19th century Paris',
  'a pointillist painting of a sunny afternoon in the park, in the style of Georges Seurat',
  'a romantic oil painting of a shipwreck in stormy seas',
  'a pencil sketch of a contemplative monk in the cloisters of a medieval monastery',
  'a landscape painting of a classical ruin, in the style of Hubert Robert',
  'an oil painting of an opulent Baroque feast, reminiscent of Jan Steen',
  'a delicate portrait miniature of a noble lady in Elizabethan attire',
  'a trompe l\'oeil oil painting of a letter rack',
  'a graphite sketch of an intricate antique timepiece',
  'a pastel drawing of a serene coastal scene at dusk',
  'a grand Baroque-style portrait of a royal court',
  'a cubist interpretation of a classical portrait',
  'an oil painting of a wistful scene of countryside tranquility',
  'a Rococo style painting of an elegant garden party',
  'an etching depicting a bustling scene from a 17th century trading port',
  'a romantic painting of a couple sharing an intimate moment under the moonlight',
  'a Victorian style portrait of a lady in an ornate dress',
  'a Byzantine style mosaic depicting a saint',
  'a Gothic style stained glass window design',
  'an oil painting of a quiet village scene, reminiscent of Pieter Bruegel the Elder',
  'a pencil drawing of an antique still life arrangement',
  'a watercolor painting of a serene English landscape in the style of John Constable',
  'a large-scale tableau of a historic royal procession',
  'a medieval tapestry design featuring a famous historical event',
  'a post-impressionist painting of a lively dance in the countryside',
  'an oil painting of a peaceful Venetian canal scene, in the style of Canaletto',
  'a marble sculpture of a famous Greek goddess',
  'a charcoal sketch of an emotional scene from a Shakespeare play',
  'a Renaissance inspired painting of a scholar in his study',
  'a detailed botanical print in the style of Maria Sibylla Merian',
  'a neoclassical architectural design of a public building',
  'a dramatic seascape painting reminiscent of J.M.W. Turner',
  'an Art Deco poster of a 1920s jazz club',
  'an ink drawing of a fairy tale castle',
  'a Romantic style painting of a vast mountainous landscape',
  'a Pre-Raphaelite style painting of a mythological scene',
  'a traditional Japanese ukiyo-e print of a samurai battle'
]

export function getRandomPrompt(prompt: string): string {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length)
  const randomPrompt = surpriseMePrompts[randomIndex]

  if (randomPrompt === prompt) return getRandomPrompt(prompt)

  return randomPrompt
}