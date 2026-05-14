# EXAMEN — Soft Delete Coherente

## Preguntas socráticas

1. **Diferencia entre archived y deleted:**

El campo archived indica que un cliente o proyecto ha sido archivado (soft delete), es decir, no se elimina de la base de datos y puede ser restaurado. El campo deleted implica un borrado definitivo (hard delete), donde el registro se no podrá recupersarse. Para cumplir el enunciado y permitir restauración, debemos usar archived para el soft delete y reservar deleted solo para borrados totales donde los datos no podrán ser recuperados.

2. **Problema operacional de no filtrar archivados:**

Si no se filtran los elementos archivados en el listado principal, el usuario verá tanto activos como archivados mezclados, lo que genera confusión y dificulta la gestión. Por ejemplo, si un usuario archivó 50 clientes hace meses, seguirán apareciendo en el listado normal, saturando la vista y dificultando encontrar los clientes realmente activos. Esto va en contra de la coherencia esperada en la experiencia de usuario.

3. **¿Qué ocurre con el índice único si archivas y creas otro con el mismo CIF?**

El índice único en (cif, company) impide crear dos clientes con el mismo CIF en la misma empresa, aunque uno esté archivado. Si intentas crear un cliente con un CIF ya existente (aunque esté archived: true), obtendrás un error de duplicidad. Puede no ser la opción correcta pero si evita ambiguedad en cuanto a los usuarios no permitiendo duplicados.

4. **¿Debe getClientById devolver un cliente archivado?**

Por coherencia con el tratamiento de proyectos, getClientById debería devolver 404 si el cliente está archivado, ya que los listados principales no muestran archivados y se entiende que un recurso archivado no está disponible para operaciones normales. Esto refuerza la separación entre activos y archivados y evita operaciones accidentales sobre elementos que el usuario considera "fuera de uso".

5. **Soft delete por defecto vs hard delete:**

El soft delete por defecto (archivar) respeta el enunciado porque permite restaurar elementos y mantener coherencia en los listados. El hard delete elimina definitivamente y no permite recuperación, lo que va en contra del objetivo de poder restaurar. Por tanto, el comportamiento correcto es usar soft delete por defecto y reservar el hard delete solo para casos excepcionales o bajo petición explícita.

## Proceso

- Tiempo invertido: 
    Tiempo de inicio 11:24 - 11:30
- Herramientas utilizadas: Google e IA (github copilot)
- Prompts exactos a IA: Pasado como contexto todo el proyecto. Dado las correciones y los requesitos dados

---

(Responde cada pregunta con 3-5 frases y documenta tu proceso real de trabajo aquí.)


