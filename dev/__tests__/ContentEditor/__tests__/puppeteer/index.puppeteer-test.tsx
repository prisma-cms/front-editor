import puppeteer from 'puppeteer'

import { toMatchImageSnapshot } from 'jest-image-snapshot'

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot })

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.screenshot({path: 'screenshot.png'});
//   await browser.close();
// })();

/**
 * Нужен сценарий для сохранения измененного контента.
 * При этом надо учитывать когда можно слушать изменения в DOM,
 * а когда нельзя. Иначе можно уйти в рекурсию.
 * Дело в том, что изменения в DOM приводят к установке нового массива newContent,
 * а передача его в updateObject() влечет за собой ререндер компонента и соответственно изменение DOM.
 * Как этого избежать?
 * В целом, на useEffect снимается обсервер на изменение контента.
 * Идея: вынести метод преобразования HTML в Components JSON в отдельный метод.
 * Тогда можно будет в тулбаре вызывать преобразования принудительно.
 * И можно будет в useMutationObserver реагировать на изменения и вызывать его.
 */

 /**
  * При кликах по кнопкам бывают эффекты, поэтому надо ставить 
  */
const sleep = (delay = 3000) => {

  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

describe('ContentEditor', () => {
  it('ContentEditorProxy', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto('https://google.com');

    // const logs = [];

    try {
      let error: Error | null = null

      page.on('console', (log) => {
        // eslint-disable-next-line no-console
        // console.log(log.type(), log.text())
        // console.log("args", log.args())

        switch (log.type()) {
          case 'debug':
            break

          case 'error':
            // throw new Error(log.text());
            if (!error) {
              error = new Error(log.text())
            } else {
              console.error(log.text())
            }
            break

          default:
            // eslint-disable-next-line no-console
            console.log(log.type(), log.text())
        }
      })

      /**
       * Загружаем страницу редактора
       */
      await page.goto('http://localhost:3000/content-editor')

      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      // console.log('frames', page.frames());
      // console.log('mainFrame', page.mainFrame());

      // const mainFrame = page.mainFrame();
      // console.log('mainFrame', mainFrame);

      // await page.evaluate(() => {

      //   document.body.innerHTML = '<p>wfwfwfdfdfghbfghfgh</p>'
      // });

      // {
      //   // const body = await page.$('body');
      //   const body = await page.$('body');

      //   await body?.evaluate((e) => {

      //     console.log('body?.evaluate e', e.innerHTML);

      //   });

      //   // console.log('body', body);
      //   console.log('body.jsonValue', await body?.jsonValue());
      //   console.log('body.asElement', await (await body?.asElement()?.getProperties())?.values());

      //   // const props = await body.getProperties();
      //   // console.log('body props', props);
      //   // console.log('body props.size', props.size);

      //   // expect(body).toMatchSnapshot(body);
      // }

      /**
       * Фиксируем редактор.
       * В дальнейшем все манипуляции с дочерними элементами должны быть именно с ним,
       * то есть инстанс не должен меняться.
       */
      const contentProxyStyled = await page.$('.ContentProxyStyled')

      expect(contentProxyStyled).toBeTruthy()

      /**
       * Toolbar тоже всегда должен быть и всегда один инстанс
       */
      const toolbar = await page.$('.ContentEditorToolbar')

      expect(toolbar).toBeTruthy()

      /**
       * Контейнер, в который выводится контент
       */
      // const contentProxyContent = await page.$('.ContentProxyContent')

      // expect(contentProxyContent).toBeTruthy()

      /**
       * Кнопка выставления режима редактирования HTML
       */

      const setEditModeHTMLButton = await toolbar?.$('[name=setEditModeHTML]')

      expect(setEditModeHTMLButton).toBeTruthy()


      const contentProxyEditor = await contentProxyStyled?.$(
        '.contentProxyEditor'
      )

      expect(contentProxyEditor).toBeTruthy()

      /**
       * Пока не перевели в режим редактирования,
       * редактируемой области не должно быть
       */
      expect(await contentProxyEditor?.evaluate(node => node.attributes.getNamedItem("contenteditable")?.value)).toBe("false")

      /**
       * Фиксируем начальный контент
       */
      expect(
        await contentProxyEditor?.evaluate((node) => node.outerHTML)
      ).toMatchSnapshot('contentProxyContent initial HTML')

      {
        /**
         * Находим кнопку сейва
         */

        const saveButton = await toolbar?.$(
          '.TagEditorToolbar--iconButton.save'
        )

        /**
         * Сейчас еще кнопки не должно быть, потому что прежде
         * надо включить режим редактирования
         */
        expect(saveButton).not.toBeTruthy()
      }

      /**
       * Переводим в режим редактирования HTML
       */

      await setEditModeHTMLButton?.click()

      await sleep();

      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      expect(
        await setEditModeHTMLButton?.evaluate((node) => node.outerHTML)
      ).toMatchSnapshot('setEditModeHTMLButton active')

      // console.log("BEFORE UPDATE CONTENT");

      /**
       * Добавляем новый HTML контент в редактируемую область
       */
      {
        const contentProxyEditor = await page.$('.contentProxyEditor')

        expect(contentProxyEditor).toBeTruthy()

        /**
         * HTML редактора до манипуляций с ним
         */
        const contentProxyEditorInitialHTML = await contentProxyEditor?.evaluate(
          (node) => {
            return node.innerHTML
          }
        )

        expect(contentProxyEditorInitialHTML).toMatchSnapshot(
          'contentProxyEditorInitialHTML'
        )

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Добавляем новый контент в редактируемую область
         */
        const contentProxyEditorUpdatedHTML = await contentProxyEditor?.evaluate(
          (node) => {
            const div = document.createElement('div')
            div.id = 'NewDiv1'

            div.innerHTML = `<p id="NewP1">NewContent1</p><p id="NewP2">NewContent2</p><p id="NewP3">NewContent3</p>`

            node.appendChild(div)

            return node.innerHTML
          }
        )

        expect(await contentProxyEditor?.$('#NewDiv1')).toBeTruthy()

        expect(contentProxyEditorUpdatedHTML).toMatchSnapshot(
          'contentProxyEditorUpdatedHTML'
        )

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()
      }

      /**
       * Находим кнопку сохранения
       */

      {
        const saveButton = await toolbar?.$(
          '.TagEditorToolbar--iconButton.save'
        )

        /**
         * Сейчас еще кнопки не должно быть, потому что прежде
         * надо включить режим редактирования
         */
        expect(saveButton).toBeTruthy()

        /**
         * Жмем кноку сохранения
         */
        await saveButton?.click()

        await sleep();

        /**
         * Делаем снимок
         */
        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Фиксируем итоговый HTML
         */
        expect(
          await contentProxyEditor?.evaluate((node) => node.outerHTML)
        ).toMatchSnapshot('contentProxyContent updated HTML')
      }

      /**
       * Проверяем реагирование кнопок тулбара на селектор
       */
      {
        /**
         * По умолчанию все кнопки кроме переключения режимов редактирования
         * должны быть неактивными
         */
        expect((await toolbar?.$$('button:enabled'))?.length).toBe(1)
        expect(
          (await toolbar?.$$('button:disabled'))?.length
        ).toBeGreaterThan(0)

        /**
         * Переключаемся в режим редактирования
         */

        await setEditModeHTMLButton?.click()

        /**
         * Делаем паузу, потому что на кнопке эффекты имеются
         */
        await sleep();

        /**
         * Фокусируемся в редактор
         */
        const contentProxyEditor = await page.$('.contentProxyEditor')

        expect(contentProxyEditor).toBeTruthy()

        /**
         * Проверяем что элемент редактируемый
         */
        expect(
          await contentProxyEditor?.evaluate((node) =>
            node.getAttribute('contentEditable')
          )
        ).toBe('true')

        /**
         * Проверяем, чтобы не был фокус на этом элементе
         */
        expect(
          await contentProxyEditor?.evaluate(
            (node) => node === document.activeElement
          )
        ).toBe(false)

        /**
         * Фокусируемся в редактируемую область
         */
        await contentProxyEditor?.click()

        await sleep();

        /**
         * Проверяем, чтобы был фокус на этом элементе
         */
        expect(
          await contentProxyEditor?.evaluate(
            (node) => node === document.activeElement
          )
        ).toBe(true)

        // await page.evaluate(() => {

        //   // console.log("selection", document.getSelection());
        //   console.log("documentOrShadowRootInstance.getSelection", documentOrShadowRootInstance.getSelection());

        // });

        await page.evaluate((container) => {
          const selection = container.getRootNode().getSelection()
          const range = document.createRange()
          // range.setStartBefore(from);
          // range.setEndAfter(to);
          range.selectNodeContents(container)
          selection.removeAllRanges()
          selection.addRange(range)
        }, contentProxyEditor)

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Удаляем выделенный контент
         * TODO: Здесь бага. Если выделены в том числе неудаляемые элементы [contenteditable=false],
         * то удаление не работает.
         */
        await page.keyboard.press('Delete')
        // await page.keyboard.press("Backspace");

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Выделяем конкретные элементы и удаляем их.
         */

        const NewDiv1 = await contentProxyEditor?.$('#NewDiv1')

        expect(NewDiv1).toBeTruthy()

        /**
         * Ожидаем 3 дочерних элемента
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(3)

        /**
         * Берем два дочерних элемента
         */
        const P1 = await NewDiv1?.$('#NewP1')
        const P2 = await NewDiv1?.$('#NewP2')

        expect(P1).toBeTruthy()
        expect(P2).toBeTruthy()

        /**
         * Выделяем эти элементы
         */
        if (P1 && P2) {
          await page.evaluate(
            (from, to) => {
              const selection = from.getRootNode().getSelection()
              const range = document.createRange()
              range.setStartBefore(from)
              range.setEndAfter(to)
              selection.removeAllRanges()
              selection.addRange(range)
            },
            P1,
            P2
          )
        }

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Удаляем выделенные элементы
         */
        await page.keyboard.press('Delete')
        // await page.keyboard.press("Backspace");

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Проверяем, что остался только один потомок
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(1)

        /**
         * Сохраняем изменения
         */

        const saveButton = await toolbar?.$(
          '.TagEditorToolbar--iconButton.save'
        )

        await saveButton?.click()

        await sleep();

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Логируем измененный контент
         */
        expect(
          await contentProxyEditor?.evaluate((node) => node.outerHTML)
        ).toMatchSnapshot('contentProxyEditor after remove 2 nodes')
      }

      /**
       * Делаем итоговый снимок страницы
       */
      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      expect(error).not.toBeTruthy()
    } finally {
      await browser.close()
    }
  })
})
